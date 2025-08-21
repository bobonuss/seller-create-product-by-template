import { Page } from '@playwright/test';
import { promises as fs } from 'fs';
import * as path from 'path';

/** Selector strategy configuration for radio button selection */
interface SelectorStrategy {
    selector: string;
    description: string;
    priority: number;
}

/** Enhanced error information for radio button interactions */
interface RadioButtonError {
    attemptedSelectors: string[];
    pageUrl: string;
    timestamp: string;
    screenshotPath?: string;
    errorMessage: string;
    functionName: string;
}

/** Prioritized selectors for dimension "No" radio button */
const DIMENSION_NO_SELECTORS: SelectorStrategy[] = [
    {
        selector: 'label:has(input[name="productPackage.hasSameDimension"][value="no"])',
        description: 'Label containing name and value attribute input for product dimension (most reliable)',
        priority: 1
    },
    {
        selector: 'label:has(input[data-testid="productPackage-hasSameDimension-no"]):first',
        description: 'First label containing data test ID input for product dimension',
        priority: 2
    },
    {
        selector: 'label:has(input[id="productPackage.hasSameDimension"][value="no"])',
        description: 'Label containing ID and value attribute input for product dimension',
        priority: 3
    }
];

/** Prioritized selectors for dimension "Yes" radio button */
const DIMENSION_YES_SELECTORS: SelectorStrategy[] = [
    {
        selector: 'label:has(input[data-testid="productPackage-hasSameDimension-yes"])',
        description: 'Label containing data test ID input for product dimension (most reliable)',
        priority: 1
    },
    {
        selector: 'label:has(input[name="productPackage.hasSameDimension"][value="yes"])',
        description: 'Label containing name and value attribute input for product dimension',
        priority: 2
    },
    {
        selector: 'label:has(input[id="productPackage.hasSameDimension"][value="yes"])',
        description: 'Label containing ID and value attribute input for product dimension',
        priority: 3
    }
];

/**
 * Creates a screenshot directory if it doesn't exist
 * @param screenshotDir - Directory path for screenshots
 */
async function ensureScreenshotDirectory(screenshotDir: string): Promise<void> {
    try {
        await fs.mkdir(screenshotDir, { recursive: true });
    } catch (error) {
        console.warn(`Could not create screenshot directory ${screenshotDir}:`, error);
    }
}

/**
 * Captures a screenshot for debugging purposes
 * @param page - The Playwright page object
 * @param functionName - Name of the function where the error occurred
 * @param timestamp - Timestamp for the screenshot filename
 * @returns Promise<string | undefined> - Path to the screenshot file, or undefined if capture failed
 */
async function captureErrorScreenshot(
    page: Page, 
    functionName: string, 
    timestamp: string
): Promise<string | undefined> {
    try {
        const screenshotDir = 'test-results/error-screenshots';
        await ensureScreenshotDirectory(screenshotDir);
        
        const screenshotPath = path.join(screenshotDir, `${functionName}-error-${timestamp}.png`);
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
        });
        
        return screenshotPath;
    } catch (error) {
        console.error('Failed to capture error screenshot:', error);
        return undefined;
    }
}

/**
 * Logs detailed error information for radio button interactions
 * @param errorInfo - RadioButtonError object containing error details
 */
function logRadioButtonError(errorInfo: RadioButtonError): void {
    const logMessage = [
        `\n=== Radio Button Error in ${errorInfo.functionName} ===`,
        `Timestamp: ${errorInfo.timestamp}`,
        `Page URL: ${errorInfo.pageUrl}`,
        `Error: ${errorInfo.errorMessage}`,
        `Attempted Selectors:`,
        ...errorInfo.attemptedSelectors.map((selector, index) => `  ${index + 1}. ${selector}`),
        errorInfo.screenshotPath ? `Screenshot: ${errorInfo.screenshotPath}` : 'Screenshot: Not captured',
        `================================================\n`
    ].join('\n');
    
    console.error(logMessage);
}

/**
 * Creates and logs a comprehensive error for radio button failures
 * @param page - The Playwright page object
 * @param functionName - Name of the function where the error occurred
 * @param attemptedSelectors - Array of selectors that were tried
 * @param errorMessage - The specific error message
 * @returns Promise<RadioButtonError> - Complete error information object
 */
export async function createRadioButtonError(
    page: Page,
    functionName: string,
    attemptedSelectors: string[],
    errorMessage: string
): Promise<RadioButtonError> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pageUrl = page.url();
    
    // Capture screenshot for debugging
    const screenshotPath = await captureErrorScreenshot(page, functionName, timestamp);
    
    const errorInfo: RadioButtonError = {
        attemptedSelectors,
        pageUrl,
        timestamp,
        screenshotPath,
        errorMessage,
        functionName
    };
    
    // Log the error details
    logRadioButtonError(errorInfo);
    
    return errorInfo;
}

/**
 * Implements retry logic with exponential backoff for selector attempts
 * @param page - The Playwright page object
 * @param selectors - Array of selector strategies to try in priority order
 * @param maxRetries - Maximum number of retry attempts per selector (default: 3)
 * @param baseDelayMs - Base delay in milliseconds for exponential backoff (default: 1000)
 * @returns Promise<void> - Resolves when selection is successful
 * @throws Error when all selectors and retries are exhausted
 */
export async function selectWithRetry(
    page: Page,
    selectors: SelectorStrategy[],
    maxRetries: number = 3,
    baseDelayMs: number = 1000
): Promise<void> {
    const attemptedSelectors: string[] = [];
    
    // Sort selectors by priority (lower number = higher priority)
    const sortedSelectors = [...selectors].sort((a, b) => a.priority - b.priority);
    
    for (const selectorStrategy of sortedSelectors) {
        const { selector, description } = selectorStrategy;
        attemptedSelectors.push(`${selector} (${description})`);
        
        console.log(`Trying selector: ${selector} - ${description}`);
        
        // Try the current selector with retry logic
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Wait for the element to be present and visible
                await page.waitForSelector(selector, { 
                    timeout: 90000,
                    state: 'visible'
                });
                
                // Check if element is clickable
                const element = page.locator(selector);
                await element.waitFor({ state: 'attached', timeout: 90000 });
                
                // Scroll element into view if needed
                await element.scrollIntoViewIfNeeded();
                
                // Attempt to click the element
                await element.click({ timeout: 90000 });
                
                // Verify the selection was successful by checking the nested radio button
                let isSelected = false;
                try {
                    if (selector.includes('label:has(input')) {
                        // For label selectors, find the nested input and check if it's selected
                        const inputElement = element.locator('input[type="radio"]');
                        await inputElement.waitFor({ state: 'attached', timeout: 90000 });
                        const inputCount = await inputElement.count();
                        if (inputCount > 0) {
                            isSelected = await inputElement.isChecked();
                        }
                    } else {
                        // For direct input selectors, use the standard verification
                        isSelected = await verifyRadioButtonSelected(page, selector);
                    }
                } catch (verificationError) {
                    console.warn(`Verification error for selector "${selector}":`, verificationError);
                    isSelected = false;
                }
                
                if (isSelected) {
                    console.log(`Successfully selected radio button using: ${selector}`);
                    return; // Success - exit the function
                } else {
                    console.warn(`Click succeeded but verification failed for selector: ${selector} (attempt ${attempt}/${maxRetries})`);
                    
                    // If verification failed and we have more attempts, wait before retrying
                    if (attempt < maxRetries) {
                        const delay = baseDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
                        console.log(`Waiting ${delay}ms before retry...`);
                        await page.waitForTimeout(delay);
                    }
                }
                
            } catch (error) {
                console.warn(`Attempt ${attempt}/${maxRetries} failed for selector "${selector}":`, error);
                
                // If this is not the last attempt, wait before retrying with exponential backoff
                if (attempt < maxRetries) {
                    const delay = baseDelayMs * Math.pow(2, attempt - 1); // Exponential backoff: 1s, 2s, 4s, etc.
                    console.log(`Waiting ${delay}ms before retry...`);
                    await page.waitForTimeout(delay);
                } else {
                    console.error(`All ${maxRetries} attempts failed for selector: ${selector}`);
                }
            }
        }
    }
    
    // If we reach here, all selectors and retries have been exhausted
    const errorMessage = `Failed to select radio button after trying ${sortedSelectors.length} selectors with ${maxRetries} retries each`;
    
    // Create comprehensive error information
    const errorInfo = await createRadioButtonError(
        page,
        'selectWithRetry',
        attemptedSelectors,
        errorMessage
    );
    
    // Throw error with detailed information
    throw new Error(`${errorMessage}. Attempted selectors: ${attemptedSelectors.join(', ')}`);
}

/**
 * Verifies that a radio button is actually selected after a click operation
 * @param page - The Playwright page object
 * @param selector - The CSS selector for the radio button to verify
 * @returns Promise<boolean> - True if the radio button is selected, false otherwise
 */
export async function verifyRadioButtonSelected(page: Page, selector: string): Promise<boolean> {
    try {
        // Wait for the element to be present
        await page.waitForSelector(selector, { timeout: 90000 });
        
        // Get the radio button element
        const radioButton = page.locator(selector);
        
        // Check if the element exists and is a radio button
        const elementCount = await radioButton.count();
        if (elementCount === 0) {
            return false;
        }
        
        // For input elements, check the 'checked' property
        const tagName = await radioButton.first().evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'input') {
            const isChecked = await radioButton.first().isChecked();
            return isChecked;
        }
        
        // For label elements, find the associated input and check its state
        if (tagName === 'label') {
            // Try to find associated input by 'for' attribute or nested input
            const forAttribute = await radioButton.first().getAttribute('for');
            
            if (forAttribute) {
                // Check input by ID referenced in 'for' attribute
                const associatedInput = page.locator(`#${forAttribute}`);
                const associatedCount = await associatedInput.count();
                if (associatedCount > 0) {
                    return await associatedInput.isChecked();
                }
            }
            
            // Check for nested input within the label
            const nestedInput = radioButton.locator('input[type="radio"]');
            const nestedCount = await nestedInput.count();
            if (nestedCount > 0) {
                return await nestedInput.first().isChecked();
            }
        }
        
        // If we can't determine the state, return false
        return false;
        
    } catch (error) {
        // If any error occurs during verification, return false
        console.error(`Error verifying radio button selection for selector "${selector}":`, error);
        return false;
    }
}

/**
 * Selects the "Yes" radio button for product dimensions using robust selector strategy
 * @param page - The Playwright page object
 * @returns Promise<void> - Resolves when the radio button is successfully selected
 * @throws Error when all selector strategies fail
 */
export async function selectProductDimensionYes(page: Page): Promise<void> {
    try {
        console.log('Attempting to select product dimension "Yes" radio button...');
        
        // Use the robust selector strategy with retry logic
        await selectWithRetry(page, DIMENSION_YES_SELECTORS);
        
        console.log('Successfully selected product dimension "Yes" radio button');
        
    } catch (error) {
        // Create comprehensive error information for debugging
        const errorInfo = await createRadioButtonError(
            page,
            'selectProductDimensionYes',
            DIMENSION_YES_SELECTORS.map(s => `${s.selector} (${s.description})`),
            `Failed to select product dimension "Yes" radio button: ${error}`
        );
        
        // Re-throw with enhanced error message
        throw new Error(`selectProductDimensionYes failed: ${error}. See console for detailed error information.`);
    }
}

/** Product Dimension, Select Option:Yes */
export async function inputProductDimensionSame(page: Page) {
    await page.locator('input[name="width"]').fill('11.6');
    await page.locator('input[name="length"]').fill('12.6');
    await page.locator('input[name="height"]').fill('13.6');
    await page.locator('input[name="weight"]').fill('14.6');
    await page.screenshot({ path: 'test-results/inputProductDimension.png', fullPage: true });

}

/** Prioritized selectors for package dimension "Yes" radio button */
const PACKAGE_DIMENSION_YES_SELECTORS: SelectorStrategy[] = [
    {
        selector: 'label:has(input[name="productPackage.hasSamePackageDimension"][value="yes"])',
        description: 'Label containing name and value attribute input for package dimension',
        priority: 1
    },
    {
        selector: 'label:has(input[id="productPackage.hasSamePackageDimension"][value="yes"])',
        description: 'Label containing ID and value attribute input for package dimension',
        priority: 2
    }
];

/**
 * Selects the "Yes" radio button for package dimensions using robust selector strategy
 * @param page - The Playwright page object
 * @returns Promise<void> - Resolves when the radio button is successfully selected
 * @throws Error when all selector strategies fail
 */
export async function selectPackageDimensionYes(page: Page): Promise<void> {
    try {
        console.log('Attempting to select package dimension "Yes" radio button...');
        
        // Use the robust selector strategy with retry logic
        await selectWithRetry(page, PACKAGE_DIMENSION_YES_SELECTORS);
        
        console.log('Successfully selected package dimension "Yes" radio button');
        
    } catch (error) {
        // Create comprehensive error information for debugging
        const errorInfo = await createRadioButtonError(
            page,
            'selectPackageDimensionYes',
            PACKAGE_DIMENSION_YES_SELECTORS.map(s => `${s.selector} (${s.description})`),
            `Failed to select package dimension "Yes" radio button: ${error}`
        );
        
        // Re-throw with enhanced error message
        throw new Error(`selectPackageDimensionYes failed: ${error}. See console for detailed error information.`);
    }
}

/** Package Dimension */
export async function inputPackageDimension(page: Page,i: number) {
    // Note: Radio button selection should be done separately using selectPackageDimensionYes() or selectPackageDimensionNo()
    // This function only fills in the dimension values
    await page.locator(`input[name="productVariants.${i}.packageDetails.0.width"]`).fill('3.6');
    await page.locator(`input[name="productVariants.${i}.packageDetails.0.length"]`).fill('5.6');
    await page.locator(`input[name="productVariants.${i}.packageDetails.0.height"]`).fill('8.6');
    await page.locator(`input[name="productVariants.${i}.packageDetails.0.weight"]`).fill('9.6');
    await page.screenshot({ path: `test-results/inputPackageDimension${i}.png`, fullPage: true });
}

export async function inputPackageDimensionOption(page: Page,i: number) {
    await page.click('text=เพิ่มบรรจุภัณฑ์ที่ 2');
    await page.locator(`input[name="productVariants.${i}.packageDetails.1.width"]`).fill('1.11');
    await page.locator(`input[name="productVariants.${i}.packageDetails.1.length"]`).fill('1.22');
    await page.locator(`input[name="productVariants.${i}.packageDetails.1.height"]`).fill('1.33');
    await page.locator(`input[name="productVariants.${i}.packageDetails.1.weight"]`).fill('1.44');
    await page.screenshot({ path: `test-results/inputPackageDimensionOption${i}.png`, fullPage: true });
}

export async function inputPackageDimensionOptionNovariant(page: Page) {
    await page.locator('input[name="productVariants.0.packageDetails.0.width"]').scrollIntoViewIfNeeded();
    await page.locator('input[name="productVariants.0.packageDetails.0.width"]').fill('1.11');
    await page.locator('input[name="productVariants.0.packageDetails.0.length"]').fill('1.22');
    await page.locator('input[name="productVariants.0.packageDetails.0.height"]').fill('1.33');
    await page.locator('input[name="productVariants.0.packageDetails.0.weight"]').fill('1.44');
    await page.screenshot({ path: 'test-results/inputPackageDimensionOption.png', fullPage: true });
}

export async function inputPackageDimensionOption2(page: Page,i: number) {
    await page.click('text=เพิ่มบรรจุภัณฑ์ที่ 3');
    await page.locator(`input[name="productVariants.${i}.packageDetails.2.width"]`).fill('3');
    await page.locator(`input[name="productVariants.${i}.packageDetails.2.length"]`).fill('4');
    await page.locator(`input[name="productVariants.${i}.packageDetails.2.height"]`).fill('5');
    await page.locator(`input[name="productVariants.${i}.packageDetails.2.weight"]`).fill('6');
    await page.screenshot({ path: `test-results/inputPackageDimensionOption2 ${i}.png`, fullPage: true });
}

/**
 * Selects the "No" radio button for product dimensions using robust selector strategy
 * @param page - The Playwright page object
 * @returns Promise<void> - Resolves when the radio button is successfully selected
 * @throws Error when all selector strategies fail
 */
export async function selectProductDimensionNo(page: Page): Promise<void> {
    try {
        console.log('Attempting to select product dimension "No" radio button...');
        
        // Use the robust selector strategy with retry logic
        await selectWithRetry(page, DIMENSION_NO_SELECTORS);
        
        console.log('Successfully selected product dimension "No" radio button');
        
    } catch (error) {
        // Create comprehensive error information for debugging
        const errorInfo = await createRadioButtonError(
            page,
            'selectProductDimensionNo',
            DIMENSION_NO_SELECTORS.map(s => `${s.selector} (${s.description})`),
            `Failed to select product dimension "No" radio button: ${error}`
        );
        
        // Re-throw with enhanced error message
        throw new Error(`selectProductDimensionNo failed: ${error}. See console for detailed error information.`);
    }
}

export async function inputProductDimensionDiff(page: Page) {
    await page.locator('input[name="productVariants.0.dimension.width"]').fill('0.1');
    await page.locator('input[name="productVariants.0.dimension.length"]').fill('0.2');
    await page.locator('input[name="productVariants.0.dimension.height"]').fill('0.3');
    await page.locator('input[name="productVariants.0.dimension.weight"]').fill('0.4');

    await page.locator('input[name="productVariants.1.dimension.width"]').fill('0.1');
    await page.locator('input[name="productVariants.1.dimension.length"]').fill('0.2');
    await page.locator('input[name="productVariants.1.dimension.height"]').fill('0.3');
    await page.locator('input[name="productVariants.1.dimension.weight"]').fill('0.4');
    await page.screenshot({ path: 'test-results/inputProductDimensionDiff.png', fullPage: true });

}

/** Prioritized selectors for package dimension "No" radio button */
const PACKAGE_DIMENSION_NO_SELECTORS: SelectorStrategy[] = [
    {
        selector: 'label:has(input[name="productPackage.hasSamePackageDimension"][value="no"])',
        description: 'Label containing name and value attribute input for package dimension',
        priority: 1
    },
    {
        selector: 'label:has(input[id="productPackage.hasSamePackageDimension"][value="no"])',
        description: 'Label containing ID and value attribute input for package dimension',
        priority: 2
    }
];

/**
 * Selects the "No" radio button for package dimensions using robust selector strategy
 * @param page - The Playwright page object
 * @returns Promise<void> - Resolves when the radio button is successfully selected
 * @throws Error when all selector strategies fail
 */
export async function selectPackageDimensionNo(page: Page): Promise<void> {
    try {
        console.log('Attempting to select package dimension "No" radio button...');
        
        // Use the robust selector strategy with retry logic
        await selectWithRetry(page, PACKAGE_DIMENSION_NO_SELECTORS);
        
        console.log('Successfully selected package dimension "No" radio button');
        
    } catch (error) {
        // Create comprehensive error information for debugging
        const errorInfo = await createRadioButtonError(
            page,
            'selectPackageDimensionNo',
            PACKAGE_DIMENSION_NO_SELECTORS.map(s => `${s.selector} (${s.description})`),
            `Failed to select package dimension "No" radio button: ${error}`
        );
        
        // Re-throw with enhanced error message
        throw new Error(`selectPackageDimensionNo failed: ${error}. See console for detailed error information.`);
    }
}

export async function clickSpecificationBtn(page: Page){
    // Try Thai text first, then English as fallback
    try {
        await page.getByRole('button').getByText('การรับประกันและคืนสินค้า').scrollIntoViewIfNeeded();
        await page.getByRole('button').getByText('การรับประกันและคืนสินค้า').click();
    } catch {
        await page.getByRole('button').getByText('Warranty & Return').scrollIntoViewIfNeeded();
        await page.getByRole('button').getByText('Warranty & Return').click();
    }
}


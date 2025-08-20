import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';
import {
    selectWithRetry,
    verifyRadioButtonSelected,
    createRadioButtonError,
    selectProductDimensionNo,
    selectProductDimensionYes
} from '../../page-objects/product/dimension-tab';

// Mock page object for isolated testing
class MockPage {
    public elements: Map<string, MockElement> = new Map();
    private _url = 'https://test.example.com';
    private screenshotCounter = 0;

    constructor() {
        // Set up default mock elements
        this.setupDefaultElements();
    }

    private setupDefaultElements() {
        // Mock successful data-testid selector
        this.elements.set('[data-testid="productPackage-hasSameDimension-no"]',
            new MockElement('input', { checked: false, visible: true, clickable: true }));

        this.elements.set('[data-testid="productPackage-hasSameDimension-yes"]',
            new MockElement('input', { checked: false, visible: true, clickable: true }));

        // Mock fallback selectors
        this.elements.set('input[name="productPackage.hasSamePackageDimension"][value="no"]',
            new MockElement('input', { checked: false, visible: true, clickable: true }));

        this.elements.set('label:has-text("ไม่มี")',
            new MockElement('label', { visible: true, clickable: true, associatedInput: 'radio-no' }));

        this.elements.set('label:has-text("No")',
            new MockElement('label', { visible: true, clickable: true, associatedInput: 'radio-no' }));
    }

    url(): string {
        return this._url;
    }

    async waitForSelector(selector: string, options?: any): Promise<void> {
        const element = this.elements.get(selector);
        if (!element || !element.visible) {
            throw new Error(`Element not found or not visible: ${selector}`);
        }
        // Simulate wait time
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    locator(selector: string) {
        const element = this.elements.get(selector);
        return new MockLocator(element, selector, this);
    }

    async screenshot(options: any): Promise<Buffer> {
        this.screenshotCounter++;
        // Return mock buffer
        return Buffer.from(`mock-screenshot-${this.screenshotCounter}`);
    }

    async waitForTimeout(ms: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, Math.min(ms, 50))); // Cap at 50ms for tests
    }

    // Helper methods for test setup
    setElementState(selector: string, state: Partial<MockElementState>) {
        const element = this.elements.get(selector);
        if (element) {
            Object.assign(element, state);
        } else {
            this.elements.set(selector, new MockElement('input', state));
        }
    }

    removeElement(selector: string) {
        this.elements.delete(selector);
    }

    makeAllElementsInvisible() {
        this.elements.forEach(element => {
            element.visible = false;
        });
    }

    makeAllElementsUnclickable() {
        this.elements.forEach(element => {
            element.clickable = false;
        });
    }
}

interface MockElementState {
    checked?: boolean;
    visible?: boolean;
    clickable?: boolean;
    associatedInput?: string;
}

class MockElement {
    public tagName: string;
    public checked: boolean;
    public visible: boolean;
    public clickable: boolean;
    public associatedInput?: string;

    constructor(tagName: string, state: MockElementState = {}) {
        this.tagName = tagName;
        this.checked = state.checked ?? false;
        this.visible = state.visible ?? true;
        this.clickable = state.clickable ?? true;
        this.associatedInput = state.associatedInput;
    }
}

class MockLocator {
    constructor(
        private element: MockElement | undefined,
        private selector: string,
        private page: MockPage
    ) { }

    async count(): Promise<number> {
        return this.element && this.element.visible ? 1 : 0;
    }

    async waitFor(options?: any): Promise<void> {
        if (!this.element || !this.element.visible) {
            throw new Error(`Element not found: ${this.selector}`);
        }
    }

    async scrollIntoViewIfNeeded(): Promise<void> {
        // Mock implementation - always succeeds
    }

    async click(options?: any): Promise<void> {
        if (!this.element) {
            throw new Error(`Element not found: ${this.selector}`);
        }
        if (!this.element.visible) {
            throw new Error(`Element not visible: ${this.selector}`);
        }
        if (!this.element.clickable) {
            throw new Error(`Element not clickable: ${this.selector}`);
        }

        // Simulate click - set checked state for radio buttons
        if (this.element.tagName === 'input') {
            this.element.checked = true;
        }

        // For labels, also set the associated input as checked
        if (this.element.tagName === 'label' && this.element.associatedInput) {
            // Find and update the associated input element
            const mockPage = this.page as any as MockPage;
            const associatedElement = mockPage.elements.get(`#${this.element.associatedInput}`);
            if (associatedElement) {
                associatedElement.checked = true;
            }
        }
    }

    async isChecked(): Promise<boolean> {
        if (!this.element) return false;
        return this.element.checked;
    }

    async evaluate(fn: (el: any) => any): Promise<any> {
        if (!this.element) throw new Error(`Element not found: ${this.selector}`);

        // Mock the evaluate function for tagName
        if (fn.toString().includes('tagName')) {
            return this.element.tagName.toLowerCase();
        }
        return null;
    }

    async getAttribute(name: string): Promise<string | null> {
        if (name === 'for' && this.element?.associatedInput) {
            return this.element.associatedInput;
        }
        return null;
    }

    first() {
        return this;
    }

    locator(childSelector: string) {
        // For nested input within label
        if (childSelector === 'input[type="radio"]' && this.element?.associatedInput) {
            const mockInput = new MockElement('input', { checked: this.element.checked });
            return new MockLocator(mockInput, childSelector, this.page);
        }
        return new MockLocator(undefined, childSelector, this.page);
    }
}

test.describe('Dimension Tab Selector Functions Unit Tests', () => {

    test.describe('Selector Priority Ordering', () => {

        test('should try selectors in correct priority order for No button', async () => {
            const mockPage = new MockPage() as any as Page;
            const consoleLogs: string[] = [];

            // Mock console.log to capture selector attempts
            const originalLog = console.log;
            console.log = (...args) => {
                consoleLogs.push(args.join(' '));
            };

            // Make first selector fail, second succeed
            mockPage.removeElement('[data-testid="productPackage-hasSameDimension-no"]');
            // Ensure the second selector exists and works
            mockPage.setElementState('input[name="productPackage.hasSamePackageDimension"][value="no"]', {
                visible: true,
                clickable: true,
                checked: false
            });

            try {
                await selectProductDimensionNo(mockPage);

                // Verify the order of selector attempts
                const selectorAttempts = consoleLogs.filter(log => log.includes('Trying selector:'));
                expect(selectorAttempts.length).toBeGreaterThan(0);

                // First attempt should be data-testid (highest priority)
                expect(selectorAttempts[0]).toContain('[data-testid="productPackage-hasSameDimension-no"]');
                expect(selectorAttempts[0]).toContain('Data test ID selector (most reliable)');

                // Second attempt should be name/value selector
                expect(selectorAttempts[1]).toContain('input[name="productPackage.hasSamePackageDimension"][value="no"]');
                expect(selectorAttempts[1]).toContain('Name and value attribute selector');

            } finally {
                console.log = originalLog;
            }
        });

        test('should try selectors in correct priority order for Yes button', async () => {
            const mockPage = new MockPage() as any as Page;
            const consoleLogs: string[] = [];

            const originalLog = console.log;
            console.log = (...args) => {
                consoleLogs.push(args.join(' '));
            };

            // Make first selector fail, second succeed
            mockPage.removeElement('[data-testid="productPackage-hasSameDimension-yes"]');
            // Ensure the second selector exists and works
            mockPage.setElementState('input[name="productPackage.hasSamePackageDimension"][value="yes"]', {
                visible: true,
                clickable: true,
                checked: false
            });

            try {
                await selectProductDimensionYes(mockPage);

                const selectorAttempts = consoleLogs.filter(log => log.includes('Trying selector:'));
                expect(selectorAttempts.length).toBeGreaterThan(0);

                // Verify priority order
                expect(selectorAttempts[0]).toContain('[data-testid="productPackage-hasSameDimension-yes"]');
                expect(selectorAttempts[1]).toContain('input[name="productPackage.hasSamePackageDimension"][value="yes"]');

            } finally {
                console.log = originalLog;
            }
        });

        test('should use data-testid selector first when available', async () => {
            const mockPage = new MockPage() as any as Page;
            const consoleLogs: string[] = [];

            const originalLog = console.log;
            console.log = (...args) => {
                consoleLogs.push(args.join(' '));
            };

            try {
                await selectProductDimensionNo(mockPage);

                const successLog = consoleLogs.find(log => log.includes('Successfully selected radio button using:'));
                expect(successLog).toContain('[data-testid="productPackage-hasSameDimension-no"]');

            } finally {
                console.log = originalLog;
            }
        });
    });

    test.describe('Verification Logic', () => {

        test('should verify radio button selection for input elements', async () => {
            const mockPage = new MockPage() as any as Page;

            // Set up a checked radio button
            mockPage.setElementState('[data-testid="productPackage-hasSameDimension-no"]', {
                checked: true
            });

            const isSelected = await verifyRadioButtonSelected(
                mockPage,
                '[data-testid="productPackage-hasSameDimension-no"]'
            );

            expect(isSelected).toBe(true);
        });

        test('should return false for unchecked radio button', async () => {
            const mockPage = new MockPage() as any as Page;

            // Set up an unchecked radio button
            mockPage.setElementState('[data-testid="productPackage-hasSameDimension-no"]', {
                checked: false
            });

            const isSelected = await verifyRadioButtonSelected(
                mockPage,
                '[data-testid="productPackage-hasSameDimension-no"]'
            );

            expect(isSelected).toBe(false);
        });

        test('should handle label elements with associated input', async () => {
            const mockPage = new MockPage() as any as Page;

            // Set up label with associated input
            mockPage.setElementState('label:has-text("ไม่มี")', {
                associatedInput: 'radio-no'
            });

            const isSelected = await verifyRadioButtonSelected(
                mockPage,
                'label:has-text("ไม่มี")'
            );

            // Should return false since the associated input is not checked
            expect(isSelected).toBe(false);
        });

        test('should return false for non-existent elements', async () => {
            const mockPage = new MockPage() as any as Page;

            const isSelected = await verifyRadioButtonSelected(
                mockPage,
                'non-existent-selector'
            );

            expect(isSelected).toBe(false);
        });

        test('should handle verification errors gracefully', async () => {
            const mockPage = new MockPage() as any as Page;

            // Remove element to cause error
            mockPage.removeElement('[data-testid="productPackage-hasSameDimension-no"]');

            const isSelected = await verifyRadioButtonSelected(
                mockPage,
                '[data-testid="productPackage-hasSameDimension-no"]'
            );

            expect(isSelected).toBe(false);
        });
    });

    test.describe('Error Handling Scenarios', () => {

        test('should create comprehensive error information', async () => {
            const mockPage = new MockPage() as any as Page;
            const attemptedSelectors = ['selector1', 'selector2'];
            const errorMessage = 'Test error message';

            const errorInfo = await createRadioButtonError(
                mockPage,
                'testFunction',
                attemptedSelectors,
                errorMessage
            );

            expect(errorInfo.functionName).toBe('testFunction');
            expect(errorInfo.attemptedSelectors).toEqual(attemptedSelectors);
            expect(errorInfo.errorMessage).toBe(errorMessage);
            expect(errorInfo.pageUrl).toBe('https://test.example.com');
            expect(errorInfo.timestamp).toBeDefined();
            expect(typeof errorInfo.timestamp).toBe('string');
        });

        test('should handle all selectors failing', async () => {
            const mockPage = new MockPage() as any as Page;

            // Make all elements invisible to cause failures
            mockPage.makeAllElementsInvisible();

            await expect(selectProductDimensionNo(mockPage)).rejects.toThrow();
        });

        test('should retry with exponential backoff', async () => {
            const mockPage = new MockPage() as any as Page;
            const startTime = Date.now();

            // Make elements unclickable to trigger retries
            mockPage.makeAllElementsUnclickable();

            try {
                await selectWithRetry(mockPage, [
                    {
                        selector: '[data-testid="productPackage-hasSameDimension-no"]',
                        description: 'Test selector',
                        priority: 1
                    }
                ], 2, 10); // 2 retries, 10ms base delay
            } catch (error) {
                // Should have taken some time due to retries
                const elapsed = Date.now() - startTime;
                expect(elapsed).toBeGreaterThan(10); // At least base delay
            }
        });

        test('should handle click success but verification failure', async () => {
            const mockPage = new MockPage() as any as Page;

            // Set up element that can be clicked but verification fails
            mockPage.setElementState('[data-testid="productPackage-hasSameDimension-no"]', {
                clickable: true,
                checked: false // Will cause verification to fail
            });

            const consoleLogs: string[] = [];
            const originalWarn = console.warn;
            console.warn = (...args) => {
                consoleLogs.push(args.join(' '));
            };

            try {
                await selectWithRetry(mockPage, [
                    {
                        selector: '[data-testid="productPackage-hasSameDimension-no"]',
                        description: 'Test selector',
                        priority: 1
                    }
                ], 2);
            } catch (error) {
                // Should have logged verification failure
                const verificationWarning = consoleLogs.find(log =>
                    log.includes('Click succeeded but verification failed')
                );
                expect(verificationWarning).toBeDefined();
            } finally {
                console.warn = originalWarn;
            }
        });

        test('should log attempted selectors on failure', async () => {
            const mockPage = new MockPage() as any as Page;

            // Remove all elements to cause complete failure
            mockPage.makeAllElementsInvisible();

            const consoleErrors: string[] = [];
            const originalError = console.error;
            console.error = (...args) => {
                consoleErrors.push(args.join(' '));
            };

            try {
                await selectProductDimensionNo(mockPage);
            } catch (error) {
                // Should have logged error with attempted selectors
                const errorLog = consoleErrors.find(log =>
                    log.includes('Radio Button Error in selectProductDimensionNo')
                );
                expect(errorLog).toBeDefined();

                const selectorLog = consoleErrors.find(log =>
                    log.includes('Attempted Selectors:')
                );
                expect(selectorLog).toBeDefined();
            } finally {
                console.error = originalError;
            }
        });
    });

    test.describe('Mock Page Interactions', () => {

        test('should successfully interact with mock page elements', async () => {
            const mockPage = new MockPage() as any as Page;

            // Test basic page interactions
            expect(mockPage.url()).toBe('https://test.example.com');

            // Test element interaction
            const locator = mockPage.locator('[data-testid="productPackage-hasSameDimension-no"]');
            await locator.click();

            const isChecked = await locator.isChecked();
            expect(isChecked).toBe(true);
        });

        test('should handle element state changes correctly', async () => {
            const mockPage = new MockPage() as any as Page;

            // Initially element should be unchecked
            let locator = mockPage.locator('[data-testid="productPackage-hasSameDimension-no"]');
            expect(await locator.isChecked()).toBe(false);

            // After click, should be checked
            await locator.click();
            expect(await locator.isChecked()).toBe(true);
        });

        test('should simulate element not found scenarios', async () => {
            const mockPage = new MockPage() as any as Page;

            // Remove element
            mockPage.removeElement('[data-testid="productPackage-hasSameDimension-no"]');

            // Should throw error when trying to interact
            const locator = mockPage.locator('[data-testid="productPackage-hasSameDimension-no"]');
            await expect(locator.click()).rejects.toThrow('Element not found');
        });

        test('should simulate element visibility states', async () => {
            const mockPage = new MockPage() as any as Page;

            // Make element invisible
            mockPage.setElementState('[data-testid="productPackage-hasSameDimension-no"]', {
                visible: false
            });

            // Should throw error when waiting for invisible element
            await expect(
                mockPage.waitForSelector('[data-testid="productPackage-hasSameDimension-no"]')
            ).rejects.toThrow('Element not found or not visible');
        });

        test('should simulate screenshot capture', async () => {
            const mockPage = new MockPage() as any as Page;

            const screenshot = await mockPage.screenshot({ path: 'test.png' });
            expect(screenshot).toBeInstanceOf(Buffer);
            expect(screenshot.toString()).toContain('mock-screenshot');
        });
    });
});
/** has warranty */
export async function hasWarranty(page) {
    await page.locator('input[role="combobox"]').click();
    await page.locator('li[data-testid="มีการรับประกันโดยผู้ขาย"]').click();
    await page.locator('input[name="warranty\.warrantyDuration"]').type('2')
    await page.locator('textarea[name="warranty\.warrantyDescription"]').type('xxx warranty description xxx');
    await page.screenshot({ path: 'test-results/hasWarranty.png', fullPage: true });
}

export async function noWarranty(page) {
    await page.locator('input[role="combobox"]').click();
    await page.locator('li[data-testid="ไม่มีการประกัน"]').click();
    
    await page.screenshot({ path: 'test-results/noWarranty.png', fullPage: true });
}

export async function noReturnPolicy(page) {
    await page.locator('input[name="warranty\.hasReturnPolicy"][value="no"]').click();
    await page.screenshot({ path: 'test-results/noReturnPolicy.png', fullPage: true });
}

export async function hasReturnPolicy(page) {
    await page.locator('input[name="warranty\.hasReturnPolicy"][value="yes"]').click({force: true});
    await page.locator('textarea[name="warranty\.returnPolicy"]').type('xxx return Policy xxx');
    await page.screenshot({ path: 'test-results/hasReturnPolicy.png', fullPage: true });
}


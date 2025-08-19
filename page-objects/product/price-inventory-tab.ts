
export async function inputPriceSale(page) {

    await page.locator('input[data-testid="price[0]"]').scrollIntoViewIfNeeded();
    await page.locator('input[data-testid="price[0]"]').type('6365.36');
    await page.locator('input[data-testid="price[1]"]').scrollIntoViewIfNeeded();
    await page.locator('input[data-testid="price[1]"]').type('2222.56');
    await page.locator('div[data-testid="productStatus[0]"]').click();
    await page.getByRole('option', { name: 'สินค้าสั่งผลิต/พรีออเดอร์'}).click();

    //await page.locator('tr.Table-module__tr--McqeC:nth-child(4) td:nth-child(4)').nth(1).click();
    
    // await page.locator('.Select-module__selectWrapper--wHTGk.Select-module__error--oUG0E.Select-module__inline--l3otI').nth(1).waitFor({ state: 'visible' });
    // await page.locator('.Select-module__selectWrapper--wHTGk.Select-module__error--oUG0E.Select-module__inline--l3otI').nth(1).click();
    await page.locator('div[data-testid="productStatus[1]"]').click();
    
    await page.getByRole('option', { name: 'พร้อมจำหน่าย'}).click();

    await page.getByTestId('preparationTime[0]').type('63');
    //await page.getByPlaceholder('กรอกระยะเวลา').nth(1).type('7');
    await page.screenshot({ path: 'test-results/inputPrice.png', fullPage: true });

}

export async function inputPriceSaleNoVariant(page,productCode) {

    await page.locator('input[name="productVariants.0.priceAndSale.price"]').first().scrollIntoViewIfNeeded();
    await page.locator('input[name="productVariants.0.priceAndSale.price"]').first().type('5656.66');

    await page.locator('tr.Table-module__tr--McqeC:nth-child(1) td:nth-child(2)').nth(0).click();
    await page.getByRole('option', { name: 'สินค้าสั่งผลิต/พรีออเดอร์'}).click();

    await page.getByPlaceholder('กรอกระยะเวลา').nth(0).type('63');
    await page.getByPlaceholder('กรอกโค้ดสินค้า').nth(0).scrollIntoViewIfNeeded();
    await page.getByPlaceholder('กรอกโค้ดสินค้า').nth(0).type(productCode+'11');

    await page.locator('input[name^="productVariants\\.0\\.inventory\\.id_"]').nth(0).scrollIntoViewIfNeeded();
    await page.locator('input[name^="productVariants\\.0\\.inventory\\.id_"]').nth(0).type('1');

    await page.screenshot({ path: 'test-results/inputPrice.png', fullPage: true });

}

export async function inputProductCode(page,productCode1,productCode2) {

    await page.getByPlaceholder('กรอกโค้ดสินค้า').nth(0).scrollIntoViewIfNeeded();
    await page.getByPlaceholder('กรอกโค้ดสินค้า').nth(0).type(productCode1);
    await page.getByPlaceholder('กรอกโค้ดสินค้า').nth(1).type(productCode2);
    await page.screenshot({ path: 'test-results/inputProductCode.png', fullPage: false });

}

export async function inputInventory(page,env) {
    await page.locator('input[name^="productVariants\\.0\\.inventory\\.id_"]').nth(0).scrollIntoViewIfNeeded();
    if (env === 'QA'){
        await page.locator('input[name^="productVariants\\.0\\.inventory\\.id_"]').nth(0).type('100');
        await page.locator('input[name^="productVariants\\.1\\.inventory\\.id_"]').nth(0).type('100');
    } else {
        await page.locator('input[name^="productVariants\\.0\\.inventory\\.id_"]').nth(0).type('0');
        await page.locator('input[name^="productVariants\\.1\\.inventory\\.id_"]').nth(0).type('0');   
    }
    await page.screenshot({ path: 'test-results/inputInventory.png', fullPage: false });
}

export async function clickImgVdoBtn(page){
    await page.getByRole('button').getByText('รูปภาพและวิดีโอ' || 'Images & Videos').scrollIntoViewIfNeeded();
    await page.getByRole('button').getByText('รูปภาพและวิดีโอ' || 'Images & Videos').click();
}
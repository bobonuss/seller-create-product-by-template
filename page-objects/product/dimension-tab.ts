/** Product Dimension */
export async function selectProductDimensionYes(page) {
    await page.locator('input[id="productPackage.hasSameDimension"][value="yes"]').click();

}

/** Product Dimension, Select Option:Yes */
export async function inputProductDimensionSame(page) {
    await page.locator('input[name="width"]').type('11.6');
    await page.locator('input[name="length"]').type('12.6');
    await page.locator('input[name="height"]').type('13.6');
    await page.locator('input[name="weight"]').type('14.6');
    await page.screenshot({ path: 'test-results/inputProductDimension.png', fullPage: true });

}

export async function selectPackageDimensionYes(page) {
    await page.locator('input[id="productPackage.hasSamePackageDimension"][value="yes"]').scrollIntoViewIfNeeded();

}

/** Package Dimension */
export async function inputPackageDimension(page) {
    await page.locator('input[id="productPackage.hasSamePackageDimension"][value="yes"]').click();
    await page.locator('input[name="productVariants.0.packageDetails.0.width"]').type('3.6');
    await page.locator('input[name="productVariants.0.packageDetails.0.length"]').type('5.6');
    await page.locator('input[name="productVariants.0.packageDetails.0.height"]').type('8.6');
    await page.locator('input[name="productVariants.0.packageDetails.0.weight"]').type('9.6');
    await page.screenshot({ path: 'test-results/inputPackageDimension.png', fullPage: true });
}

export async function inputPackageDimensionOption(page) {
    await page.click('text=เพิ่มบรรจุภัณฑ์ที่ 2');
    await page.locator('input[name="productVariants.0.packageDetails.1.width"]').type('1.11');
    await page.locator('input[name="productVariants.0.packageDetails.1.length"]').type('1.22');
    await page.locator('input[name="productVariants.0.packageDetails.1.height"]').type('1.33');
    await page.locator('input[name="productVariants.0.packageDetails.1.weight"]').type('1.44');
    await page.screenshot({ path: 'test-results/inputPackageDimensionOption.png', fullPage: true });
}

export async function inputPackageDimensionOptionNovariant(page) {
    await page.locator('input[name="productVariants.0.packageDetails.0.width"]').scrollIntoViewIfNeeded();
    await page.locator('input[name="productVariants.0.packageDetails.0.width"]').type('1.11');
    await page.locator('input[name="productVariants.0.packageDetails.0.length"]').type('1.22');
    await page.locator('input[name="productVariants.0.packageDetails.0.height"]').type('1.33');
    await page.locator('input[name="productVariants.0.packageDetails.0.weight"]').type('1.44');
    await page.screenshot({ path: 'test-results/inputPackageDimensionOption.png', fullPage: true });
}

export async function inputPackageDimensionOption2(page) {
    await page.click('text=เพิ่มบรรจุภัณฑ์ที่ 3');
    await page.locator('input[name="productVariants.0.packageDetails.2.width"]').type('3');
    await page.locator('input[name="productVariants.0.packageDetails.2.length"]').type('4');
    await page.locator('input[name="productVariants.0.packageDetails.2.height"]').type('5');
    await page.locator('input[name="productVariants.0.packageDetails.2.weight"]').type('6');
    await page.screenshot({ path: 'test-results/inputPackageDimensionOption2.png', fullPage: true });
}

export async function selectProductDimensionNo(page) {
    await page.locator('input[id="productPackage.hasSameDimension"][value="no"]').click();

}

export async function inputProductDimensionDiff(page) {
    await page.locator('input[name="productVariants.0.dimension.width"]').type('0.1');
    await page.locator('input[name="productVariants.0.dimension.length"]').type('0.2');
    await page.locator('input[name="productVariants.0.dimension.height"]').type('0.3');
    await page.locator('input[name="productVariants.0.dimension.weight"]').type('0.4');

    await page.locator('input[name="productVariants.1.dimension.width"]').type('0.1');
    await page.locator('input[name="productVariants.1.dimension.length"]').type('0.2');
    await page.locator('input[name="productVariants.1.dimension.height"]').type('0.3');
    await page.locator('input[name="productVariants.1.dimension.weight"]').type('0.4');
    await page.screenshot({ path: 'test-results/inputProductDimensionDiff.png', fullPage: true });

}

export async function selectPackageDimensionNo(page) {
    await page.locator('input[id="productPackage.hasSamePackageDimension"][value="no"]').scrollIntoViewIfNeeded({});

}

export async function clickSpecificationBtn(page){
    await page.getByRole('button').getByText('การรับประกันและคืนสินค้า' || 'Warranty & Return').scrollIntoViewIfNeeded();
    await page.getByRole('button').getByText('การรับประกันและคืนสินค้า' || 'Warranty & Return').click();
}


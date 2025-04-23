export async function selectImage(page) {    
    /** select image 1 */
    await page.locator('div[data-index="0"] div[data-testid="upload-image-hover"]').scrollIntoViewIfNeeded();
    await page.locator('div[data-index="0"] div[data-testid="upload-image-hover"]').hover();
    await page.click('text=เลือกไฟล์จากคลังภาพของร้าน');

    await page.locator('div[id="headlessui-portal-root"] img[src]').nth(0).click();
    await page.locator('div[id="headlessui-portal-root"] img[src]').nth(1).click();
    await page.locator('div[id="headlessui-portal-root"] img[src]').nth(2).click();

    await page.screenshot({ path: 'test-results/select-image-1.png', fullPage: true });
    await page.locator('button:text("ใช้กับตัวเลือกสินค้านี้")').click();

    /** select image 2 */
    await page.locator('div[data-index="1"] div[data-testid="upload-image-hover"]').scrollIntoViewIfNeeded();
    await page.locator('div[data-index="1"] div[data-testid="upload-image-hover"]').hover();
    await page.click('text=เลือกไฟล์จากคลังภาพของร้าน');

    await page.locator('div[id="headlessui-portal-root"] img[src]').nth(0).click();
    await page.locator('div[id="headlessui-portal-root"] img[src]').nth(1).click();
    await page.locator('div[id="headlessui-portal-root"] img[src]').nth(2).click();

    await page.screenshot({ path: 'test-results/select-image-2.png', fullPage: true });
    await page.locator('button:text("ใช้กับตัวเลือกสินค้านี้")').click();

}

export async function selectImageNovariant(page) {

    /** select image 1 */
    await page.locator('div.media-dnd-module__listWrapper--8b-In').nth(0).scrollIntoViewIfNeeded();
    await page.locator('div.media-dnd-module__listWrapper--8b-In').nth(0).hover();
    await page.click('text=เลือกไฟล์จากคลังภาพของร้าน');

    await page.locator('div.media-library-module__selectableImageWrapper--YJAXB').nth(0).click();
    await page.locator('div.media-library-module__selectableImageWrapper--YJAXB').nth(1).click();
    await page.locator('div.media-library-module__selectableImageWrapper--YJAXB').nth(2).click();

    await page.screenshot({ path: 'test-results/select-image-1.png', fullPage: true });
    await page.locator('button:text("ใช้กับตัวเลือกสินค้านี้")').click();

}

export async function selectVdo(page) {

    await page.evaluate(() => {
        console.log('Debugging message');
        // หรือ debug ค่าตัวแปร
        console.log('Locator:', document.querySelector('div.media-dnd-module__mediaUpload--C1uOr'));
      });

    await page.locator('div.media-dnd-module__mediaUpload--C1uOr').nth(2).scrollIntoViewIfNeeded();
    await page.locator('div.media-dnd-module__mediaUpload--C1uOr').nth(2).hover();
    await page.click('text=เลือกไฟล์จากคลังวิดีโอของร้าน');
    await page.locator('div.media-library-module__selectableImageWrapper--YJAXB').nth(0).click();
    await page.locator('button:text("ใช้กับสินค้านี้")').click();

}

export async function selectVdoNoVaraint(page) {

    await page.locator('div.media-dnd-module__mediaUpload--C1uOr').nth(1).scrollIntoViewIfNeeded();
    await page.locator('div.media-dnd-module__mediaUpload--C1uOr').nth(1).hover();
    await page.click('text=เลือกไฟล์จากคลังวิดีโอของร้าน');
    await page.locator('div.media-library-module__selectableImageWrapper--YJAXB').nth(0).click();
    await page.locator('button:text("ใช้กับสินค้านี้")').click();

}

export async function clickDimensionBtn(page){
    await page.getByRole('button').getByText('ขนาดสินค้าและบรรจุภัณฑ์' || 'Product & Package Dimensions').scrollIntoViewIfNeeded();
    await page.getByRole('button').getByText('ขนาดสินค้าและบรรจุภัณฑ์' || 'Product & Package Dimensions').click();
}
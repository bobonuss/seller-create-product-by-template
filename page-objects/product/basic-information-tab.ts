/*** add product information */

import { test, expect } from '@playwright/test'
 
export async function addProductName(page,productName,category){
    await page.fill('input[name="productDetail.nameTH"]', productName);
    await page.screenshot({ path: `test-results/${category}/addProductName.png`, fullPage: true });
}

// for no variant
export async function addProductName2(page,productName){
    await page.fill('input[name="productDetail.nameTH"]', productName,' 2');
    await page.screenshot({ path: 'test-results/addProductName.png', fullPage: true });
}


export async function verifyBasicInformationTab(page) {
    
}

export async function selectCategory(page,category){
    await page.getByPlaceholder('เลือกหรือพิมพ์เพื่อค้นหาหมวดหมู่สินค้า').click();
    await page.getByPlaceholder('เลือกหรือพิมพ์เพื่อค้นหาหมวดหมู่สินค้า').type(category.trim());
    const locator = await page.locator(`//div[@class="caption-4" and text()="${category.trim()}"]`);
    await locator.click({ text: `${category.trim()}`});
    await page.screenshot({ path: 'test-results/selectCategory.png', fullPage: true });
}

export async function addProductDescription(page,category){
    const descriptionLocator = page.locator('.tiptap');
    await descriptionLocator.waitFor({ state: 'visible' });
    await descriptionLocator.click();
    // await descriptionLocator.waitFor({ state: 'visible' });
    await page.keyboard.type('<p><strong>คุณสมบัติสำคัญ:</strong></p>\n<ol>\n<li><strong>SerenityTech Comfort:</strong> นวัตกรรม SerenityTech ของเราทำให้ได้รับการสนับสนุนและความสบายที่ดีที่สุด', { delay: 1 });
    // await descriptionLocator.type('<p><strong>คุณสมบัติสำคัญ:</strong></p>\n<ol>\n<li><strong>SerenityTech Comfort:</strong> นวัตกรรม SerenityTech ของเราทำให้ได้รับการสนับสนุนและความสบายที่ดีที่สุด ปรับตัวตามรูปร่างของร่างกายของคุณเพื่อให้ได้รับการนอนหลับที่ดีที่สุด</li>\n<li><strong>EleganceCraft Design:</strong> ดีไซน์ที่ดูดีของเตียงเพิ่มความหรูหราในห้องนอนของคุณ สร้างที่พักผ่อนที่เงียบสงบและทันสมัย</li>\n<li><strong>CloudSoft Pillow Top:</strong> สนุกกับความสบายจาก CloudSoft pillow top ที่ให้พื้นผิวนุ่มนวลและสบายสบายสำหรับประสบการณ์การนอนหลับที่ช่วยฟื้นฟูร่างกาย</li>\n<li><strong>TranquilTouch Fabric:</strong> ผ้า TranquilTouch เพิ่มประสบการณ์ทางสัมผัส ให้ความรู้สึกอ่อนโยนและนุ่มนวลต่อผิว</li>\n<li><strong>DreamGuard Protection:</strong> เทคโนโลยี DreamGuard ช่วยให้เตียงป้องกันจากสารก่อภูมิแพ้ ไรฝุ่น และคราบ ทำให้คุณได้รับการนอนหลับในสภาพแวดล้อมที่สะอาดและมีสุขภาพ</li>\n</ol>\n<p><strong>ข้อมูลเฉพาะ:</strong></p>\n<ul>\n<li>ตัวเลือกขนาด: มีให้เลือกตามขนาดต่าง ๆ เพื่อตอบสนองความต้องการของคุณ</li>\n<li>วัสดุ: วัสดุคุณภาพสูงสำหรับความทนทานและความถูกต้อง</li>\n<li>การประกอบง่าย: การประกอบที่ง่ายดายเพื่อความสะดวกของคุณ</li>\n</ul>\n');
    await page.screenshot({ path: `test-results/${category}/addProductDescription.png`, fullPage: true });
}    

export async function clickSpecificationBtn(page){
    await page.getByRole('button').getByText('คุณลักษณะสินค้า' || 'Specification').scrollIntoViewIfNeeded();
    await page.getByRole('button').getByText('คุณลักษณะสินค้า' || 'Specification').click();
}


export async function verifyCategoryName(page,expectedValue){

    const actualCategory = await page.locator('[data-testid="หมวดหมู่สินค้า"]').inputValue();
    console.log("actualCategory:", actualCategory);

    // Use the expect assertion
    await expect(actualCategory.trim()).toBe(expectedValue);

}


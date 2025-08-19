import { readExcelColumn, getColumnCount } from '../../utils/readExcel.ts'
import { getRandomNumber } from '../../utils/randomIndex.ts'
import { createHash } from 'crypto'
import { expect } from '@playwright/test';

/** Select brand */
export async function selectBrand(page) {
    await page
        .locator('#PRODUCT_SPECIFICATION')
        .getByText('ข้อมูลสินค้าเบื้องต้น')
        .scrollIntoViewIfNeeded()
    await page.getByPlaceholder('เลือกแบรนด์/ยี่ห้อ').click()
    await page.getByRole('option', { name: 'icebear' }).click()
}

/** Model name */
export async function selectModelName(page) {
    await page.locator('[data-testid="ชื่อรุ่นหรือโมเดล"]').click();
    await page.keyboard.type('NocNoc model test', { delay: 1 });
    await page.screenshot({ path: `test-results/selectModelName.png`, fullPage: true });
}

export async function selectApplicationArea(page) {
    await page.getByTestId(`พื้นที่ใช้งาน`).first().scrollIntoViewIfNeeded();    
    await page.getByTestId(`พื้นที่ใช้งาน`).first().click();    

    //await page.click('[data-testid="พื้นที่ใช้งาน"]').first().click()

    // const mainEl = page.getByRole("option");
    // await mainEl.getByText("ภายนอก").isVisible()
    //   ? mainEl.getByText("ภายนอก").click()
    //   : mainEl.getByText("Outdoor").click();
    await page.locator('[data-testid="ภายนอก"], [data-testid="ภายในอาคาร"]').click();

    // await page.getByRole('option', { name: 'ภายนอก' || 'Outdoor'}).click();
    // await page.getByRole('option', { name: 'ห้องนั่งเล่น' || 'Living Room'}).first().click();
    await page.getByTestId(`พื้นที่ใช้งาน`).first().click();
    // await page
    //     .locator('label.label-2')
    //     .filter({ hasText: 'พื้นที่ใช้งาน' })
    //     .first()
    //     .click()
}

export async function selectManufacturingCount(page) {
    await page
        .getByTestId(`ประเทศผู้ผลิตสินค้า`)
        .first()
        .scrollIntoViewIfNeeded()
    await page.getByTestId(`ประเทศผู้ผลิตสินค้า`).first().click()
    await page.getByRole('option', { name: 'Thailand'}).click()
    // await page.getByTestId('ประเทศผู้ผลิตสินค้า').first().click();
}

export async function selectSellUnit(page,category) {
    //await page.locator('[data-testid="หน่วยการขาย"]').highlight();
    await page.locator('[data-testid="หน่วยการขาย"]').click({ force: true });
    await page.waitForTimeout(1000);
    // await page.pause();
    await page.screenshot({
        path: `test-results/${category}/clickSellUnit.png`,
        fullPage: true,
    })
    //await page.locator('[data-testid="หน่วยการขาย"]').highlight();

    //await page.getByTestId(`หน่วยการขาย`).locator(`input`).fill(`ชิ้น`);
    await page.getByTestId(`หน่วยการขาย`).click();    
    await page.getByRole('option', { name: 'ชิ้น' }).click()
}

export async function selectProductOptionYes(page) {
    await page
        .locator('div')
        .filter({ hasText: /^มี$/ })
        .first()
        .scrollIntoViewIfNeeded()
    await page.locator('div').filter({ hasText: /^มี$/ }).first().click()
}

export async function selectProductOptionNo(page) {
    await page
        .locator('div')
        .filter({ hasText: /^ไม่มี$/ })
        .first()
        .scrollIntoViewIfNeeded()
    await page
        .locator('div')
        .filter({ hasText: /^ไม่มี$/ })
        .first()
        .click()
}

export async function addProductOptionValue(page, lang,category) {
    /** option vl 1 */
    await page
        .getByPlaceholder('เลือกหมวดหมู่คุณลักษณะ')
        .first()
        .scrollIntoViewIfNeeded()
    await page.getByPlaceholder('เลือกหมวดหมู่คุณลักษณะ').first().click()
    //await page.getByRole('option', { name: 'สี' }).click();

    //await page.click(`text=สี, text=Color`);
    //await page.getByRole('option', { name: 'สี' || 'Color'}).click();
    await page.click(`[data-testid="Color"], [data-testid="สี"]`, { timeout: 3000 })

    // const optionName = lang === 'th' ? 'สี' : 'Color';
    // await page.getByRole('option', { name: optionName }).click();

    await page.locator('input[name="variant"]').first().type('แดง')
    await page.getByRole('button', { name: 'เพิ่ม', exact: true }).click()
    await page.screenshot({
        path: `test-results/${category}/addProductOptionValue-1.png`,
        fullPage: true,
    })

    await page.locator('input[name="variant"]').first().scrollIntoViewIfNeeded()
    await page.locator('input[name="variant"]').first().type('ฟ้า')
    await page.getByRole('button', { name: 'เพิ่ม', exact: true }).click()
    await page.screenshot({
        path: `test-results/${category}/addProductOptionValue-2.png`,
        fullPage: true,
    })

    /** option vl 2 */
    await page
        .getByPlaceholder('เลือกหมวดหมู่คุณลักษณะ')
        .first()
        .scrollIntoViewIfNeeded()
    await page.screenshot({
        path: `test-results/${category}/addProductOptionValue-3.png`,
        fullPage: true,
    })

    await page.click('text=เพิ่มหมวดหมู่ให้ตัวเลือกสินค้า')
    await page.getByPlaceholder('เลือกหมวดหมู่คุณลักษณะ').nth(1).click()
    // await page.getByRole('option', { name: 'ขนาด', exact: true }).click();
    // const optionName2 = lang === 'th' ? 'ขนาด' : 'Size';
    // await page.getByRole('option', { name: optionName2 }).click();

    await page.click(`[data-testid="ขนาด"], [data-testid="Size"], [data-testid="ไซส์"], [data-testid="สไตล์"]`, { timeout: 3000 })
    //wait page.getByRole('option', { name: 'ขนาด' || 'Size'}).click();

    await page
        .getByPlaceholder('กรอกชื่อตัวเลือก แล้วกดเพิ่ม หรือ Enter')
        .nth(1)
        .scrollIntoViewIfNeeded()
    await page.screenshot({
        path: `test-results/${category}/addProductOptionValue-4.png`,
        fullPage: true,
    })

    await page
        .getByPlaceholder('กรอกชื่อตัวเลือก แล้วกดเพิ่ม หรือ Enter')
        .nth(1)
        .click()
    await page
        .getByPlaceholder('กรอกชื่อตัวเลือก แล้วกดเพิ่ม หรือ Enter')
        .nth(1)
        .type('50cm')
    await page
        .getByRole('button', { name: 'เพิ่ม', exact: true })
        .nth(1)
        .click()
    await page.screenshot({
        path: `test-results/${category}/addProductOptionValue-5.png`,
        fullPage: true,
})
}

export async function selectProductType(page) {
    // await page
    //     .getByPlaceholder('เลือกประเภทสินค้า')
    //     .first()
    //     .scrollIntoViewIfNeeded()

    //     await page
    //     .getByPlaceholder('เลือกประเภทสินค้า')
    //     .first()
    //     .click()
    //await page.locator('#headlessui-combobox-input-r1k').first().scrollIntoViewIfNeeded();
    await page.locator('[data-test-id="virtuoso-scroller"]').scrollIntoViewIfNeeded();
 
    //await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="0"] .relative input[placeholder="เลือกประเภทสินค้า"]').first().scrollIntoViewIfNeeded()
    //await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="0"] .relative input[placeholder="เลือกประเภทสินค้า"]').first().click()
    await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="0"] [data-testid="productTypeId[0]"]').scrollIntoViewIfNeeded();
    await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="0"] [data-testid="productTypeId[0]"]').click();
    await page.screenshot({
        path: 'test-results/scrollToTable.png',
        fullPage: true,
    })
    //await page.getByRole('option', { name: 'สินค้าเท่านั้น' || 'Product Only' }).click();
    
    await page.click(
        `[data-testid="สินค้าเท่านั้น"], [data-testid="Product Only"]`
    )

    //await page.getByPlaceholder('เลือกประเภทสินค้า').nth(1).click() 
    await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="1"] [data-testid="productTypeId[1]"]').scrollIntoViewIfNeeded();
    await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="1"] [data-testid="productTypeId[1]"]').click();
    //await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="1"] div.Select-module__selectWrapper--wHTGk').first().click();

    //await page.click(`[data-testid="สินค้าที่มีบริการประกอบ/ติดตั้งฟรีจากผู้ขาย"], [data-testid="Product Only"]`)
    await page.screenshot({
        path: 'test-results/clickProductType.png',
        fullPage: true,
    })
    await page.locator('text=สินค้าที่ต้องประกอบ/ติดตั้งสินค้าเอง').click();

}

export async function selectProductCondition(page) {
    // await page.getByPlaceholder('เลือกเงื่อนไขสินค้า').first().scrollIntoViewIfNeeded()
    // await page.getByPlaceholder('เลือกเงื่อนไขสินค้า').first().click();

    await page.waitForSelector('[data-test-id="virtuoso-item-list"] tr[data-index="0"] [data-testid="productConditionId[0]"]', { state: 'visible' });
    await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="0"] [data-testid="productConditionId[0]"]').scrollIntoViewIfNeeded();
    await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="0"] [data-testid="productConditionId[0]"]').click({ force: true });
    await page.click(`[data-testid="ใหม่"], [data-testid="New"]`)

    // await page.waitForSelector('[data-test-id="virtuoso-item-list"] tr[data-index="1"] Select-module__inputWrapper--FCVCA .Select-module__open--em2v- Select-module__md--rUTXe', { state: 'visible' });
    // await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="1"] Select-module__inputWrapper--FCVCA .Select-module__open--em2v- Select-module__md--rUTXe').nth(1).click({ force: true });
    await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="1"] [data-testid="productConditionId[1]"]').click();
    await page.locator('[data-test-id="virtuoso-item-list"] tr[data-index="1"] [data-testid="productConditionId[1]"]').click();
    await page.click(`[data-testid="ใหม่"], [data-testid="New"]`)

    await page.screenshot({
        path: 'test-results/selectProductCondition.png',
        fullPage: true,
    })
}

export async function addAllMetadata(
    page,
    workbook,
    filePath,
    sheetName,
    lang,
    variantNumber,
    category,
    valueForm
) {
    const colCount = await getColumnCount(filePath, workbook, sheetName) // count column is not null
    // console.log('colCount:', colCount);
    // console.log('getRandomNumber',getRandomNumber(colLength));
    // console.log('columnData['+i+']:', columnName, columnData[i]);
    let countLoop = 0

    for (let i = 1; i < colCount; i++) {
        let remainder = i
        let columnLabel = ''

        while (remainder >= 0) {
            // แปลงเลขตำแหน่ง (i) เป็นตัวอักษรตามรูปแบบ A, B, C, ...
            const charCode = (remainder % 26) + 65 // 65 คือรหัส ASCII ของ A
            columnLabel = String.fromCharCode(charCode) + columnLabel
            remainder = Math.floor(remainder / 26) - 1
        }
        const columnData = await readExcelColumn(
            columnLabel,
            workbook,
            filePath,
            sheetName
        ) // read data col
        const colLength = columnData.length
        //console.log('columnData length:', columnLabel," : ", colLength);

        const metadataType = columnData[13].trim()
        //const isRequired = columnData[14] && columnData[14].trim();
        const level = columnData[15].trim()

        if (lang == 'th' && i % 2 != 0) {
            console.log('TH Selected Column Labels:', columnLabel)
            //console.log('col data', columnData);
            // for(let y=0; y < colLength ; y++){
            //     console.log('col data '+y+' :', columnData[y]);
            // }
            console.log('col data 10: ', columnData[10])
            console.log('col data 11: ', columnData[11])
            let index = await getRandomNumber(colLength)
            console.log('index:', index)

            if (metadataType === 'Selective' && level === 'Product') {
                //await page.getByPlaceholder('เลือก'+columnData[11]).first().scrollIntoViewIfNeeded();
                //await page.getByPlaceholder('เลือก'+columnData[11]).first().click();

                // await page.locator(`//input[starts-with(@placeholder, 'เลือก${columnData[11]}') and normalize-space(@placeholder)='เลือก${columnData[11]}']`).first().scrollIntoViewIfNeeded();
                // await page.locator(`//input[starts-with(@placeholder, 'เลือก${columnData[11]}') and normalize-space(@placeholder)='เลือก${columnData[11]}']`).first().click();
                console.log(columnData[11])
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .scrollIntoViewIfNeeded()
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .click()
                //console.log('columnData[index]:', columnData[index].trim());

                // verify data in dropdown
                let rowIndex = 16;  // Excel rows start at index 1
                let expectedLists: string[] = [];
                while (true) {
                    const cell = columnData[rowIndex];  // Read the first column of the current row                
                    if (!cell) {  // Check if the cell is empty or undefined
                      break;
                    }               
                    expectedLists.push(cell.toString());
                    rowIndex++;
                  }

                const options = await page.locator('li[data-testid]').evaluateAll(items => 
                    items.map(item => item.textContent.trim())
                );
            

                expect(options.length).toEqual(expectedLists.length);
                const expectedListsSorted = expectedLists.sort()
                const actualListsSorted = options.sort()
                expect(expectedListsSorted).toEqual(actualListsSorted);
                console.log('Verify Selective PRoduct Element Pass')
                await page.getByTestId(columnData[16].toString().trim()).first().click()
                valueForm[columnData[10]] = columnData[16].toString().trim()
                //await page.getByRole('option', { name: columnData[index],exact: true }).first().click();
                await page.screenshot({
                    path: `test-results/${category}/metadata-selective-product.png`,
                    fullPage: true,
                })
            }

            if (metadataType === 'Selective' && level === 'Variant') {
                //const columnName = "เลือก" + columnData[11];
                // await page.getByTestId(`${columnData[11].trim()}`).first().scrollIntoViewIfNeeded();
                // await page.getByTestId(`${columnData[11].trim()}`).first().click();
                for (let j = 0; j < variantNumber; j++) {
                        await page
                        .getByTestId(`${columnData[11].trim()}`+`[${j}]`)
                        .first()
                        .scrollIntoViewIfNeeded()
                        await page
                        .getByTestId(`${columnData[11].trim()}`+`[${j}]`)
                        .first()
                        .click()


                       // verify data in dropdown
                       let rowIndex = 16;  // Excel rows start at index 1
                       let expectedLists: string[] = [];
                       while (true) {
                           const cell = columnData[rowIndex];  // Read the first column of the current row                
                           if (!cell) {  // Check if the cell is empty or undefined
                           break;
                           }               
                           expectedLists.push(cell);
                           rowIndex++;
                       }

                       const options = await page.locator('li[data-testid]').evaluateAll(items => 
                           items.map(item => item.textContent.trim())
                       );
                       expect(options.length).toEqual(expectedLists.length);
                       const expectedListsSorted = expectedLists.sort()
                       const actualListsSorted = options.sort()
                       expect(expectedListsSorted).toEqual(actualListsSorted);
                       console.log('Verify Selective Variant Element Pass')


                        const listBoxItems = await page.$$(`[role="listbox"] li`) // Adjust the selector based on your HTML structure
                        await listBoxItems[0].click()
                        await page
                        .locator('thead')
                        .nth(1)
                        .click()
                        const firstText = await listBoxItems[0].evaluate(el => el.textContent.trim());
                        valueForm[columnData[10]] = firstText
                    //await page.getByRole('option', { name: columnData[index],exact: true}).first().click();
                    // await page.getByTestId(`${columnData[index].trim()}`, { exact: true }).nth(0).scrollIntoViewIfNeeded();
                    // await page.getByTestId(`${columnData[index].trim()}`, { exact: true }).nth(0).click();
                    await page.screenshot({
                        path: `test-results/${category}/metadata-selective-Variant-${j}.png`,
                        fullPage: true,
                    })
                }
                // await page.getByTestId(`${columnData[11].trim()}`, { exact: true }).nth(1).scrollIntoViewIfNeeded();
                // await page.getByTestId(`${columnData[11].trim()}`, { exact: true }).nth(1).click();
                // await page.getByTestId(`${columnData[index].trim()}`, { exact: true }).nth(0).scrollIntoViewIfNeeded();
                // await page.getByTestId(`${columnData[index].trim()}`, { exact: true }).nth(0).click();
                //await page.getByTestId(`${columnData[index].trim()}`).nth(0).click();
                // console.log(`${columnData[11].trim()}`)
                // await page
                //     .getByTestId(`${columnData[11].trim()}`)
                //     .nth(1)
                //     .scrollIntoViewIfNeeded()
                // await page
                //     .getByTestId(`${columnData[11].trim()}`)
                //     .nth(1)
                //     .click()
                // const listBoxItems2 = await page.$$(`[role="listbox"] li`) // Adjust the selector based on your HTML structure
                // await listBoxItems2[0].click()
                // await page
                //     .locator('thead.Table-module__thead--E9YE2')
                //     .nth(1)
                //     .click()
                // await page.screenshot({
                //     path: 'test-results/metadata-selective-Variant-2.png',
                //     fullPage: true,
                // })
            }

            if (metadataType === 'Free Text' && level === 'Product') {
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .scrollIntoViewIfNeeded()
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .click()
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .type('Robocrop')
                valueForm[columnData[10]] = "Robocrop"
                await page.screenshot({
                    path: `test-results/${category}/metadata-FreeText-Product.png`,
                    fullPage: true,
                })
            }

            if (metadataType === 'Free Text' && level === 'Variant') {
                //const columnName1 = "กรอกรายละเอียด" + columnData[11];
                await page
                    .getByTestId(columnData[11].trim())
                    .first()
                    .scrollIntoViewIfNeeded()
                await page.getByTestId(columnData[11].trim()).first().click()
                await page
                    .getByTestId(columnData[11].trim())
                    .first()
                    .type('xxxx')

                // await page.getByRole('cell', { name: columnName1}).nth(0).scrollIntoViewIfNeeded();
                // await page.getByRole('cell', { name: columnName1}).nth(0).click();
                // await page.getByRole('cell', { name: columnName1}).nth(0).type('1111');

                await page
                    .getByTestId(columnData[11].trim())
                    .nth(1)
                    .scrollIntoViewIfNeeded()
                await page.getByTestId(columnData[11].trim()).nth(1).click()
                await page
                    .getByTestId(columnData[11].trim())
                    .nth(1)
                    .type('xxxxxx')
                valueForm[columnData[10]] = "xxxxxx"
                await page.screenshot({
                    path: `test-results/${category}/metadata-FreeText-Variant-1.png`,
                    fullPage: true,
                })
            }

            if (metadataType === 'Multi-Selective' && level === 'Product') {
                // await page.locator(`//input[contains(text(), 'เลือก${columnData[11]}')]`).first().scrollIntoViewIfNeeded();
                // await page.locator(`//input[contains(text(), 'เลือก${columnData[11]}')]`).first().click();

                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .scrollIntoViewIfNeeded()
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .click()
                await page.getByRole('listbox').click()

                // verify data in dropdown
                let rowIndex = 16;  // Excel rows start at index 1
                let expectedLists: string[] = [];
                while (true) {
                    const cell = columnData[rowIndex];  // Read the first column of the current row                
                    if (!cell) {  // Check if the cell is empty or undefined
                    break;
                    }               
                    expectedLists.push(cell);
                    rowIndex++;
                }

                const options = await page.locator('li[data-testid]').evaluateAll(items => 
                    items.map(item => item.textContent.trim())
                );
                expect(options.length).toEqual(expectedLists.length);
                const expectedListsSorted = expectedLists.sort()
                const actualListsSorted = options.sort()
                expect(expectedListsSorted).toEqual(actualListsSorted);
                console.log('Verify Multi select Product Element Pass')

                //await page.getByText(`${columnData[index].trim()}`).nth(0).click();
                //await page.click(`text=${columnData[11].trim()}`);
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .click()

                    const text = await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .textContent();
                valueForm[columnData[10]] = text?.trim()
                await page.screenshot({
                    path: `test-results/${category}/screenshot-C2-5.png`,
                    fullPage: true,
                })
            }

            if (metadataType === 'Multi-Selective' && level === 'Variant') {
                for (let j = 0; j < variantNumber; j++) {
                    await page
                    .getByTestId(`${columnData[11].trim()}`+`[${j}]`)
                    .first()
                    .scrollIntoViewIfNeeded()
                    await page
                    .getByTestId(`${columnData[11].trim()}`+`[${j}]`)
                    .first()
                    .click()


                   // verify data in dropdown
                   let rowIndex = 16;  // Excel rows start at index 1
                   let expectedLists: string[] = [];
                   while (true) {
                       const cell = columnData[rowIndex];  // Read the first column of the current row
                       console.log(cell)                
                       if (!cell) {  // Check if the cell is empty or undefined
                       break;
                       }               
                       expectedLists.push(cell);
                       rowIndex++;
                   }
                   
                   const options = await page.locator('li[data-testid]').evaluateAll(items => 
                       items.map(item => 
                        item.textContent.trim()
                       )
                   );
                   console.log(options)
                   expect(options.length).toEqual(expectedLists.length);
                   const expectedListsSorted = expectedLists.sort()
                   const actualListsSorted = options.sort()
                   expect(expectedListsSorted).toEqual(actualListsSorted);
                   console.log('Verify Selective Variant Element Pass')


                    const listBoxItems = await page.$$(`[role="listbox"] li`) // Adjust the selector based on your HTML structure
                    await listBoxItems[0].click()
                    await page
                    .locator('thead')
                    .nth(1)
                    .click()
                    const firstText = await listBoxItems[0].evaluate(el => el.textContent.trim());
                    valueForm[columnData[10]] = firstText
                //await page.getByRole('option', { name: columnData[index],exact: true}).first().click();
                // await page.getByTestId(`${columnData[index].trim()}`, { exact: true }).nth(0).scrollIntoViewIfNeeded();
                // await page.getByTestId(`${columnData[index].trim()}`, { exact: true }).nth(0).click();
                await page.screenshot({
                    path: `test-results/${category}/metadata-selective-Variant-${j}.png`,
                    fullPage: true,
                })
            }

                // await page
                //     .getByTestId(`${columnData[11].trim()}`)
                //     .first()
                //     .scrollIntoViewIfNeeded()
                // await page
                //     .getByTestId(`${columnData[11].trim()}`)
                //     .first()
                //     .click()
                // const listBoxItems = await page.$$(`[role="listbox"] li`) // Adjust the selector based on your HTML structure
                // await listBoxItems[0].click()

                // // verify data in dropdown
                // let rowIndex = 16;  // Excel rows start at index 1
                // let expectedLists: string[] = [];
                // while (true) {
                //     const cell = columnData[rowIndex];  // Read the first column of the current row                
                //     if (!cell) {  // Check if the cell is empty or undefined
                //     break;
                //     }               
                //     expectedLists.push(cell);
                //     rowIndex++;
                // }

                // const options = await page.locator('li[data-testid]').evaluateAll(items => 
                //     items.map(item => item.textContent.trim())
                // );
                // expect(options.length).toEqual(expectedLists.length);
                // const expectedListsSorted = expectedLists.sort()
                // const actualListsSorted = options.sort()
                // expect(expectedListsSorted).toEqual(actualListsSorted);
                // console.log('Verify Multi Selective Varint Element Pass')

                // await page
                //     .locator('thead.Table-module__thead--E9YE2')
                //     .nth(1)
                //     .click()
                // await page.screenshot({
                //     path: `test-results/${category}/screenshot-C2-3.png`,
                //     fullPage: true,
                // })


                // await page
                //     .getByTestId(`${columnData[11].trim()}`)
                //     .nth(1)
                //     .scrollIntoViewIfNeeded()
                // await page
                //     .getByTestId(`${columnData[11].trim()}`)
                //     .nth(1)
                //     .click()
                // const listBoxItems2 = await page.$$(`[role="listbox"] li`) // Adjust the selector based on your HTML structure
                // await listBoxItems2[0].click()
                // await page
                //     .locator('thead.Table-module__thead--E9YE2')
                //     .nth(1)
                //     .click()
                // await page.screenshot({
                //     path: `test-results/${category}/screenshot-C2-4.png`,
                //     fullPage: true,
                // })
            }

            if (metadataType === 'Integer' && level === 'Product') {
                await page
                    .getByTestId(columnData[11].trim())
                    .first()
                    .scrollIntoViewIfNeeded()
                await page.getByTestId(columnData[11].trim()).first().click()
                await page.getByTestId(columnData[11].trim()).first().type('2')
                valueForm[columnData[10]] = 2
                await page.screenshot({
                    path: `test-results/${category}/screenshot-C2-4-1.png`,
                    fullPage: true,
                })
            }

            if (metadataType === 'Integer' && level === 'Variant') {
                //const columnName1 = "กรอกรายละเอียด" + columnData[11];
                // await page
                //     .getByTestId(columnData[11].trim())
                //     .nth(0).scrollIntoViewIfNeeded()
                // await page.getByTestId(columnData[11].trim()).nth(0).click()
                // await page.getByTestId(columnData[11].trim()).nth(0).type('3')
                // //expect(page.getByTestId(columnData[11].trim()).nth(0)).toHaveText('3');
                // valueForm[columnData[10]] = 3

                // await page
                //     .getByTestId(columnData[11].trim())
                //     .nth(1).scrollIntoViewIfNeeded()
                // await page.getByTestId(columnData[11].trim()).nth(1).click()
                // await page.getByTestId(columnData[11].trim()).nth(1).type('6')
                // //expect(page.getByTestId(columnData[11].trim()).nth(1)).toHaveText('6');
                // valueForm[columnData[10]] = 6

                // await page.screenshot({
                //     path: `test-results/${category}/metadata-integer-Variant-1.png`,
                //     fullPage: true,
                // })

                for (let j = 0; j < variantNumber; j++) {
                    await page
                    .getByTestId(`${columnData[11].trim()}`+`[${j}]`)
                    .first()
                    .scrollIntoViewIfNeeded()
                    await page
                    .getByTestId(`${columnData[11].trim()}`+`[${j}]`)
                    .first()
                    .click()
                    await page.getByTestId(`${columnData[11].trim()}`+`[${j}]`).type('6')
                    valueForm[columnData[10]] = 6
                await page.screenshot({
                    path: `test-results/${category}/metadata-interger-Variant-${j}.png`,
                    fullPage: true,
                })
                
            }
            }

            if (metadataType === 'Numeric' && level === 'Product') {
                await page
                    .getByTestId(columnData[11].trim())
                    .first()
                    .scrollIntoViewIfNeeded()
                await page.getByTestId(columnData[11].trim()).first().click()
                await page.getByTestId(columnData[11].trim()).first().type('1.11')
                valueForm[columnData[10]] = 1.11
                await page.screenshot({
                    path: `test-results/${category}/screenshot-C2-4-1.png`,
                    fullPage: true,
                })
            }

            if (metadataType === 'Numeric' && level === 'Variant') {
                //const columnName1 = "กรอกรายละเอียด" + columnData[11];
                // await page
                //     .getByTestId(columnData[11].trim())
                //     .nth(0).scrollIntoViewIfNeeded()
                // await page.getByTestId(columnData[11].trim()).nth(0).click()
                // await page.getByTestId(columnData[11].trim()).nth(0).type('2.56')
                //expect(page.getByTestId(columnData[11].trim()).nth(0)).toHaveText('3');


                // await page
                //     .getByTestId(columnData[11].trim())
                //     .nth(1).scrollIntoViewIfNeeded()
                // await page.getByTestId(columnData[11].trim()).nth(1).click()
                // await page.getByTestId(columnData[11].trim()).nth(1).type('3.24')
                //expect(page.getByTestId(columnData[11].trim()).nth(1)).toHaveText('6');

                // await page.screenshot({
                //     path: `test-results/${category}/metadata-integer-Variant-1.png`,
                //     fullPage: true,
                // })

                for (let j = 0; j < variantNumber; j++) {
                    await page
                    .getByTestId(`${columnData[11].trim()}`+`[${j}]`)
                    .first()
                    .scrollIntoViewIfNeeded()
                    await page
                    .getByTestId(`${columnData[11].trim()}`+`[${j}]`)
                    .first()
                    .click()
                    await page.getByTestId(`${columnData[11].trim()}`+`[${j}]`).type('3.24')
                    valueForm[columnData[10]] = 3.24
                await page.screenshot({
                    path: `test-results/${category}/metadata-interger-Variant-${j}.png`,
                    fullPage: true,
                })
            }
            }
        }

        if (lang == 'en' && i % 2 == 0) {
            console.log('EN Selected Column Labels:', columnLabel)
        }

    }
    return valueForm
}

export async function clickPriceInventBtn(page) {
    await page
        .getByRole('button')
        .getByText('ราคาและสต็อกสินค้า')
        .scrollIntoViewIfNeeded()
    await page
        .getByRole('button')
        .getByText('ราคาและสต็อกสินค้า')
        .click()
}

export async function addAllMetadataIfSelectNo(
    page,
    workbook,
    filePath,
    sheetName,
    lang
) {
    const colCount = await getColumnCount(filePath, workbook, sheetName) // count column is not null

    //console.log('colCount:', colCount);
    //console.log('getRandomNumber',getRandomNumber(colLength));
    //console.log('columnData['+i+']:', columnName, columnData[i]);
    let countLoop = 0

    for (let i = 1; i < colCount; i++) {
        let remainder = i
        let columnLabel = ''

        while (remainder >= 0) {
            // แปลงเลขตำแหน่ง (i) เป็นตัวอักษรตามรูปแบบ A, B, C, ...
            const charCode = (remainder % 26) + 65 // 65 คือรหัส ASCII ของ A
            columnLabel = String.fromCharCode(charCode) + columnLabel
            remainder = Math.floor(remainder / 26) - 1
        }
        const columnData = await readExcelColumn(
            columnLabel,
            workbook,
            filePath,
            sheetName
        ) // read data col
        const colLength = columnData.length
        //console.log('columnData length:', columnLabel," : ", colLength);

        const metadataType = columnData[13].trim()
        //const isRequired = columnData[14] && columnData[14].trim();
        const level = columnData[15].trim()

        if (lang == 'th' && i % 2 != 0) {
            console.log('TH Selected Column Labels:', columnLabel)
            //console.log('col data', columnData);
            // for(let y=0; y < colLength ; y++){
            //     console.log('col data '+y+' :', columnData[y]);
            // }
            console.log('col data 10: ', columnData[10])


            let index = await getRandomNumber(colLength)
            console.log('index:', index)

            await page
            .getByPlaceholder(`เลือกประเภทสินค้า`)
            .first()
            .scrollIntoViewIfNeeded()

            await page
            .getByPlaceholder(`เลือกประเภทสินค้า`)
            .first()
            .click()
            
            await page.click(
                `[data-testid="สินค้าเท่านั้น"], [data-testid="Product Only"]`
            )

            await page
            .getByPlaceholder(`เลือกเงื่อนไขสินค้า`)
            .first()
            .scrollIntoViewIfNeeded()
            await page
            .getByPlaceholder(`เลือกเงื่อนไขสินค้า`)
            .first()
            .click()
             await page.click(`[data-testid="ใหม่"], [data-testid="New"]`)

            if (metadataType === 'Selective') {
 
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .scrollIntoViewIfNeeded()
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .click()
                await page.getByTestId(columnData[16].trim()).first().click()
                await page.screenshot({
                    path: 'test-results/metadata-selective-product.png',
                    fullPage: true,
                })
            }
            if (metadataType === 'Free Text') {
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .scrollIntoViewIfNeeded()
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .click()
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .type('Robocrop')
                await page.screenshot({
                    path: 'test-results/metadata-FreeText-Product.png',
                    fullPage: true,
                })
            }
            if (metadataType === 'Multi-Selective') {

                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .scrollIntoViewIfNeeded()
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .click()
                await page.getByRole('listbox').click()
                //await page.getByText(`${columnData[index].trim()}`).nth(0).click();
                //await page.click(`text=${columnData[11].trim()}`);
                await page
                    .getByTestId(`${columnData[11].trim()}`)
                    .first()
                    .click()
                await page.screenshot({
                    path: 'test-results/screenshot-C2-5.png',
                    fullPage: true,
                })
            }
            if (metadataType === 'Integer') {
                await page
                    .getByTestId(columnData[11].trim())
                    .first()
                    .scrollIntoViewIfNeeded()
                await page.getByTestId(columnData[11].trim()).first().click()
                await page.getByTestId(columnData[11].trim()).first().type('2')
                await page.screenshot({
                    path: 'test-results/screenshot-C2-4-1.png',
                    fullPage: true,
                })
            }
            if (metadataType === 'Numeric') {
                await page
                    .getByTestId(columnData[11].trim())
                    .first()
                    .scrollIntoViewIfNeeded()
                await page.getByTestId(columnData[11].trim()).first().click()
                await page.getByTestId(columnData[11].trim()).first().type('1.11')
                await page.screenshot({
                    path: 'test-results/screenshot-C2-4-1.png',
                    fullPage: true,
                })
            }

        }

        if (lang == 'en' && i % 2 == 0) {
            console.log('EN Selected Column Labels:', columnLabel)
        }
    }
}

export async function clickShowMoreMetadata (page) {
    const moreInfoButton = page.locator('text=แสดงข้อมูลเพิ่มเติม');
    if (await moreInfoButton.count() > 0) {
        await moreInfoButton.scrollIntoViewIfNeeded();
        await moreInfoButton.click();
    } else {
        console.log('The "แสดงข้อมูลเพิ่มเติม" button was not found on the page.');
    }
}
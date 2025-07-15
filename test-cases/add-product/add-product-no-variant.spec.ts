import * as logins from '../../page-objects/common/login.ts';
import * as menu from '../../page-objects/common/seller-menu.ts';
import * as productsPage from '../../page-objects/product/products-page.ts';
import * as basicInformation from '../../page-objects/product/basic-information-tab.ts';
import * as specification from '../../page-objects/product/specification-tab.ts';
import * as priceInvent from '../../page-objects/product/price-inventory-tab.ts';
import * as imageVideo from '../../page-objects/product/image-vdo-tab.ts';
import * as dimension from '../../page-objects/product/dimension-tab.ts';
import * as warranty from '../../page-objects/product/warranty-tab.ts';
import * as database from '../../page-objects/product/database.ts';
import * as api from '../../page-objects/common/api.ts';
import { genProductName } from '../../utils/productName.ts';
import { generateProductCode } from '../../utils/productCode.ts';
import { test } from '../../test-config.ts';
import { readNameOfAllSheet, returnCategoryName, returnExpectCategoryName }  from '../../utils/readExcel.ts';
import { url } from '../../test-data/url.ts'

const env = 'QA'
//const env = ''
let filePath
let userName,password,sellerName

if (env === 'QA'){
  filePath = '../../test-data/TSELL-1192-Outdoor-Spaces-Activities-qa-2.xlsx'; // Replace with your Excel file path
  userName = 'icebear.bot5@gmail.com';
  password = 'Test1234!';
  sellerName = 'icebear5'
} else {
  filePath = '../../test-data/chunk-3.xlsx'; // Replace with your Excel file path
  userName = 'automate.bot12@gmail.com';
  password = 'Prod98765!';
  sellerName = 'TestProd1'
}

let lang = 'th'; // lang = 'th' or 'en' only
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile(filePath);

test.describe("add successfully product", () => {
  test.describe.configure({ mode: "serial" });
    // code พัง
  test('has no variant', async ({ page, sellerCredential }) => {

      console.log("has no variant");
      test.slow();
      await logins.sellerLogin(page,url.qa,sellerCredential.sellerUsername,sellerCredential.sellerPassword);
      //await logins.sellerLogin(page,url.prod,sellerCredential.sellerUsername,sellerCredential.sellerPassword);
      await logins.verifySuccessfulLogin(page,sellerCredential.sellerName);
      await logins.closePopupTaskManage(page);
      await logins.changeLang(page, lang)
      let countLoop = 0;

      const allSheetName =  readNameOfAllSheet(workbook,filePath);
      const sheetLength = await allSheetName.length;
      console.log('lengthhhh: '+ sheetLength);

        for (let i = 0; i < sheetLength; i++) {
            console.log('Tab '+i+' : '+allSheetName[i]);
            countLoop += 1;
            console.log('Loop Count: ',countLoop);
  
            // Skip Fan category for now 
            if (countLoop == 12)
              continue;
  
            /** Category */
            const category = returnCategoryName(workbook,lang,filePath,allSheetName[i]);
            console.log("cate: "+category) ;

            const productName = genProductName(category);
            console.log('product name = '+productName + ' 2');
  
            await menu.gotoAddNewProduct(page,url.qa_product);
            //await menu.gotoAddNewProduct(page,url.prod_product);
            //await productsPage.verifyProductsManagementPage({page});
            await productsPage.clickAddNewProductButton({page});
  
            /** Basic Information */
            await basicInformation.addProductName(page,productName,category);
            await basicInformation.selectCategory(page,category.toString());
            await basicInformation.addProductDescription(page,category);
            await basicInformation.clickSpecificationBtn(page);
  
            /** Specification */
            await specification.selectBrand(page);
            await specification.selectApplicationArea(page);
            await specification.selectManufacturingCount(page);
            await specification.selectSellUnit(page,category);
            
            await specification.selectProductOptionNo(page);
            await specification.addAllMetadataIfSelectNo(page,workbook,filePath,allSheetName[i],lang);
            await specification.clickPriceInventBtn(page);
  
            /** Price and Inventory */
            // await priceInvent.inputPriceSaleNoVariant(page,productCode1);
            await priceInvent.clickImgVdoBtn(page);
  
            /** Image and Video */
            await imageVideo.selectImageNovariant(page);
            await imageVideo.selectVdoNoVaraint(page);
            await imageVideo.clickDimensionBtn(page);
  
            /** Dimension */
            await dimension.inputProductDimensionSame(page);
            await dimension.inputPackageDimensionOptionNovariant(page);
            await dimension.inputPackageDimensionOption(page);
            await dimension.inputPackageDimensionOption2(page);
            await dimension.clickSpecificationBtn(page);
  
            /** Warranty */
            await warranty.hasWarranty(page);
            await warranty.hasReturnPolicy(page);
            
            /** Save Submit */
            // await productsPage.clickSubmitBtn(page);

            /** Save Draft */
            await productsPage.clickSaveBtn(page);
            await page.waitForTimeout(3000);

            console.log('Add product successfully.');
        }
  });

});
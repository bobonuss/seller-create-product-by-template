const XLSX = require('xlsx');

export async function convertArrayToExcel(allResults) {
    const flatArray = allResults.flat();

    // 2. สร้าง worksheet และ workbook
    const worksheet = XLSX.utils.json_to_sheet(flatArray);

    worksheet['!cols'] = [
        { wch: 60 }, // skuNumber
        { wch: 60 }, // productName
        { wch: 60 }  // category
      ];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    
    // 3. เขียนเป็นไฟล์ Excel
    XLSX.writeFile(workbook, "products.xlsx");
}
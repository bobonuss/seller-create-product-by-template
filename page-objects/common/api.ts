import { request } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { Buffer } from "buffer";

export async function queryOSCategoryIndex(categoryDetail) {
  const username = "kantaphit_ru"; 
  const password = '}61zwiIjar6J307s'; 
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  const requestBody = {
    query: {
      match: {
        categoryCode: {
          query: categoryDetail.category_code,
        },
      },
    },
  };

  const apiRequest = await request.newContext({});

  const response = await apiRequest.post('https://vpc-nocnoc-nonprod-os-data-blb3wnym55xediwt3i332ia6ia.ap-southeast-1.es.amazonaws.com/qa.product_category/_search', {
    headers: { Authorization: authHeader  },
    data: requestBody,
  });

  // ตรวจสอบผลลัพธ์จาก response
  if (response.ok()) {
    const data = await response.json();
    const result = data.hits.hits[0]._source
    return result
  } else {
    console.error('Failed to create post:', response.status());
  }
}

export async function queryOSCProductIndex(sku) {
  const username = "kantaphit_ru"; 
  const password = '}61zwiIjar6J307s'; 
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  const requestBody = {
        query: {
            terms: {
                skuNumber: sku
            }
        }
    }
    const apiRequest = await request.newContext({});

    const response = await apiRequest.post('https://vpc-nocnoc-nonprod-os-data-blb3wnym55xediwt3i332ia6ia.ap-southeast-1.es.amazonaws.com/qa.scg_es_product_th/_search', {
      headers: { Authorization: authHeader  },
      data: requestBody,
    });

    // ตรวจสอบผลลัพธ์จาก response
    if (response.ok()) {
      const data = await response.json();
      const result = data.hits.hits
      return result
    } else {
      console.error('Failed to create post:', response.status());
    }
  }


export async function verifyOSCategory(categoryDetail,expectCategory) {
    const apiData = await queryOSCategoryIndex(categoryDetail)
    const excelCateTreelists = expectCategory.split('>').map(item => item.trim());
    const cateIndexCateTreeLists = apiData.categoryTree
    //Verify catetree in category index
    expect(apiData.categoryCode).toEqual(categoryDetail.category_code);
    expect(apiData.nameTh).toEqual(categoryDetail.name);
    cateIndexCateTreeLists.map((e,index)=>{
      if(index === 0){
        expect(e.nameTh).toEqual("สินค้า");
      } else {
        expect(e.nameTh).toEqual(excelCateTreelists[index-1]);
      }
    })
}

export async function verifyOSProduct(categoryDetail,sku,techspecValue) {
    const skuLists = sku.map(e=>e.sku)
    const apiData = await queryOSCProductIndex(skuLists)
    if (apiData.length === 0) {
      console.error('API returned empty data:', apiData);
      throw new Error('API response is empty!');
    } else {
      const resultLists: {
        skuNumber: any;
        productName: any;
        category: any;
      }[] = [];
      apiData.map(e=>{
      const data = e._source
      expect(data.primaryCategoryName_en).toEqual(categoryDetail.name_en);
      expect(data.primaryCategoryName_th).toEqual(categoryDetail.name);
      expect(String(data.primaryCategory.o_id[0])).toEqual(categoryDetail.category_code);
      for (const [key, expectedValue] of Object.entries(techspecValue)) {
        const actualValue = data[key];
      
        let valueToCompare;
      
        if (Array.isArray(actualValue)) {
          // ถ้าเป็น array → ดึง value ของทุกอันมารวมเป็น string (หรือ array ถ้าต้องการ)
          valueToCompare = actualValue.map(item => item?.value).join(', ');
        } else if (typeof actualValue === 'object' && actualValue !== null && 'value' in actualValue) {
          valueToCompare = actualValue.value;
        } else {
          valueToCompare = actualValue;
        }
      
        expect(valueToCompare).toBe(expectedValue);
      }
      const resultObject = {
        "skuNumber": data.skuNumber,
        "productName": data.webname,
        "category": data.primaryCategoryName_th
      }
      resultLists.push(resultObject)
    })
    return resultLists
    }
}
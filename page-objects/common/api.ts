import { request } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { Buffer } from "buffer";

export async function queryESCategoryIndex(categoryDetail) {
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

export async function queryESCProductIndex(sku) {
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
    console.log(requestBody)
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


export async function verifyESCategory(categoryDetail) {
    const apiData = await queryESCategoryIndex(categoryDetail)
    expect(apiData.categoryCode).toEqual(categoryDetail.category_code);
    expect(apiData.nameTh).toEqual(categoryDetail.name);
}

export async function verifyESProduct(categoryDetail,sku) {
    const skuLists = sku.map(e=>e.sku)
    const apiData = await queryESCProductIndex(skuLists)
    if (apiData.length === 0) {
      console.error('API returned empty data:', apiData);
      throw new Error('API response is empty!');
    } else {
      apiData.map(e=>{
      const data = e._source
      expect(data.primaryCategoryName_en).toEqual(categoryDetail.name_en);
      expect(data.primaryCategoryName_th).toEqual(categoryDetail.name);
      expect(String(data.primaryCategory.o_id[0])).toEqual(categoryDetail.category_code);
    })
    }
}
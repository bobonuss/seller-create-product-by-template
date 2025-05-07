/**
 * @returns product name
 */
import {getCurrentDate} from './getDate'
import {generateRandomSixDigitNumber} from './randomNumber'

export function genProductName(category){
    console.log(category)
    return '[Do not approve] สินค้าQA-'+ category.trim() +' '+ getCurrentDate() +'-'+ generateRandomSixDigitNumber();
}
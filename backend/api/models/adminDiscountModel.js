import db from '../../config/dbConfig.js';
// create discount

export const createBrandDiscount = async (discountData) => {

    const discount = await db("brand_discounts").insert(discountData).returning('*');    

    return discount;
}


// create discount with category

export const createCategoryDiscount = async (discountData) => {

    const discount = await db("category_discounts").insert(discountData).returning('*');

    return discount;
}
import db from '../../config/dbConfig.js';

// create product

export const createAProduct = async (productData) => {
    const newUser = await db("products").insert(productData).returning('*');
    return newUser;
};







// ____________________________________________________________________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________________________________________________________________


// create price
export const createPrdPrice = async (priceData) => {
    const price = await db("products_price").insert(priceData).returning('*');
    return price;
}

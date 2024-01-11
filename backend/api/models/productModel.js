import db from '../../config/dbConfig.js';


// create product
export const createProducts = async (productData) => {
    const newUser = await db("products").insert(productData).returning('*');
    return newUser;
};






// ____________________________________________________________________________________________________________________________________________________________________________


// create price
export const createPrdPrice = async (priceData) => {
    const price = await db("products_price").insert(priceData).returning('*');
    return price;
}
import db from '../../config/dbConfig.js';

// create product

export const createAProduct = async (productData) => {
    const newUser = await db("products").insert(productData).returning('*');
    return newUser;
};







// ____________________________________________________________________________________________________________________________________________________________________________
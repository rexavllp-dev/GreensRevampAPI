import db from '../../config/dbConfig.js';

// create product

export const createAProduct = async (productData) => {
    const newUser = await db("products").insert(productData).returning('*');
    return newUser;
};


// update model

export const updateAproduct = async (productId, updatedData) => {
    const updatedProduct = await db('products').where({ id: productId })
        .update(updatedData)
        .returning('*'); // Return the updated product
}








// ____________________________________________________________________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________________________________________________________________


// create price

export const createPrdPrice = async (priceData) => {
    const price = await db("products_price").insert(priceData).returning('*');
    return price;
}

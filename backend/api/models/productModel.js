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

// get a product

export const getProductById = async (productId) => {
    const product = await db('products')
            .select('*')
            .where({ id: productId })
            .first();

            return product;
}

// get all products

export const getAllProducts = async () => {

    const products = await db('products').select('*');
    return products;

}

// delete product

export const deleteAProduct = async (productId) => {
    const deletedProduct = await db('products').where({ id: productId }).del();
    return deletedProduct;
}










// ____________________________________________________________________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________________________________________________________________









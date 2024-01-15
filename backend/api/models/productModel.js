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








// ____________________________________________________________________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________________________________________________________________


// create price

export const createPrdPrice = async (priceData) => {
    const price = await db("products_price").insert(priceData).returning('*');
    return price;
}



// update price
export const updatePrdPrice = async (id, priceData) => {
    const price = await db("products_price").where({ id }).update(priceData).returning();
    return price;
};

// get a price
export const getPrdPrice = async (id) => {
    const price = await db("product_price").where({ id }).first();
    return price;
}






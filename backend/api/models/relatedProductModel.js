import db from '../../config/dbConfig.js';

// related products

export const addRelatedProduct = async (relatedProductData) => {

    const relatedProduct = await db('related_products').insert(relatedProductData).returning('*');
    return relatedProduct;
}





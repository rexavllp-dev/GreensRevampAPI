import db from '../../config/dbConfig.js';

// related products

export const addRelatedProduct = async (relatedProductData) => {
    const relatedProduct = await db('related_products').insert(relatedProductData).returning('*');
    return relatedProduct;
};


// get related products by product id

export const getRelatedProductsByProductId = async (productId) => {
    const relatedProducts = await db('related_products')
        .leftJoin(
            'products',
            'related_products.related_product_id',
            '=',
            'products.id'
        )
        .where('related_products.product_id', productId);

    return relatedProducts;
};




export const deleteARelatedProduct = async (relatedProductId) => {
    const deleted = await db('related_products')
        .where({ id: relatedProductId })
        .del();
    return deleted;
};



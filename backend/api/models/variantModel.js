import db from '../../config/dbConfig.js';


export const createVariant = async (variantData) => {
    const variant = await db('variants').insert(variantData).returning('*');
    return variant;
};


export const deleteAVariant = async (variantId) => {
    const deleteVariant = db('variants').where({ id: variantId }).del();
    return deleteVariant;
};

export const getVariantsWithProductId = async (productId) => {
    const variants = await db('product_variants')
        .leftJoin('variants', 'product_variants.variant_id', 'variants.id')
        .where({
            'product_variants.product_id': productId
        })
        .select(
            'variants.*',
        )
    return variants;
};
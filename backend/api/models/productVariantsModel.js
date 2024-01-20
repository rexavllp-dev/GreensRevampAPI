import db from '../../config/dbConfig.js';

export const createProductVariant = async (variantData) => {
    const productVariant = await db('product_Variants').insert(variantData).returning('*');
    return productVariant;
};


export const getVariantLabel = async (variantId, productId) => {
    console.log(variantId, productId);
    const variant = await db('product_variants')
        .select(
            'variant_label',
            'product_id',
            'variant_id',
        )
        .where({
            variant_id: variantId,
            product_id: productId
        });
    return variant;
};

// update Variant label
export const updateVariantLabel = async ( product_variantId, variant_label) => {
    const updatedVariant = await db('product_variants')
        .where({
            id: product_variantId
        })
        .update(variant_label)
        .returning('*');
    return updatedVariant;
};

// delete Variant label
export const deleteAVariantLabel = async (product_variantId) => {
    const deleteVariant = db('product_variants').where({ id: product_variantId }).del();
    return deleteVariant;
}
import db from '../../config/dbConfig.js';


export const createProductVariant = async (data) => {
    const productVariant = await db('product_variants').insert(data).returning('*');
    return productVariant;
};


// update Variant label

export const updateVariantLabel = async (product_variantId, variant_label) => {
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




export const getVariantValuesByVariantId = async (variantId) => {

    const variant = await db('product_variants')
        .leftJoin('variants', 'product_variants.variant_id', 'variants.id')
        .leftJoin('products', 'product_variants.product_id', 'products.id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .select(
            'product_variants.*',
            'variants.*',
            'variants.id as variant_id',
            'products.*',
            'products.id as product_id',
            "product_inventory.*",
            "product_inventory.id as product_inventory_id",

        )
        .where({
            "product_variants.variant_id": variantId,
        });
    console.log(variantId);
    return variant;
};


export const checkVariantLabelExist = async (variantId, productId) => {
    const variant = await db('product_variants')
        .where({
            variant_id: variantId,
            product_id: productId,
        })
        .select('*')
    return variant;
}


export const getVariantsByProductId = async (productId) => {
    console.log(productId);
    const variants = await db('product_variants')
        .leftJoin('products', 'products.id', '=', 'product_variants.variant_id')
        .leftJoin('product_gallery', 'products.id', '=', 'product_gallery.product_id')
        .where('product_variants.product_id', productId)
        .select(
            'product_variants.*',
            'products.*',
            'product_gallery.*'

        );
    return variants;
};

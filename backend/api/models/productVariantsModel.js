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
            'product_variants.id as productVariantId',
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
            'product_variants.id as product_variant_id',
            'products.*',
            'products.id as product_id',


            db.raw(`
            jsonb_agg(
                jsonb_build_object(
                    'url', product_gallery.url,
                    'id', product_gallery.id,
                    'is_baseimage', product_gallery.is_baseimage
                )
            ) as product_img
        `)

        )
        .distinct('product_variants.variant_id')
        .groupBy(

            'product_variants.id',
            'products.id')

        .orderBy('product_variants.created_at', 'asc')

    return variants;
};




export const getProductVariantsByIDs = async (data) => {
    const productIds = data.map(item => item.product_id);
    const variantIds = data.map(item => item.variant_id);

    const variants = await db('product_variants')
        .whereIn('product_id', productIds)
        .whereIn('variant_id', variantIds);

    return variants;
};




export const getAllProductVariants = async (productId) => {
    const relatedProducts = await db('product_variants')
        .where({ product_id: productId })
        .select('*');

    return  relatedProducts;
}


// Function to retrieve all product variants associated with a given product_id
export const getVariantsFromProductVariants = async (variantId) => {
    const relatedProducts = await db('product_variants')
        .where({ variant_id: variantId })
        .select('*');
    return relatedProducts;
}
import db from '../../config/dbConfig.js';

// related products

export const addRelatedProduct = async (relatedProductData) => {
    const relatedProduct = await db('related_products').insert(relatedProductData).returning('*');
    return relatedProduct;
};


// get related products by product id

export const getRelatedProductsByProductId = async (productId) => {
    const relatedProducts = await db('related_products')
        .leftJoin('products', 'related_products.related_product_id', 'products.id')
        .leftJoin('brands', 'products.prd_brand_id', 'brands.id')
        .leftJoin('product_category', 'products.id', 'product_category.product_id')
        .leftJoin('categories', 'product_category.category_id', 'categories.id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .leftJoin('product_seo', 'products.id', 'product_seo.product_id')
        .leftJoin('product_badge', 'products.id', 'product_badge.product_id')
        .where('related_products.product_id', productId)


        .select(
            'products.*',
            'products.id as product_id',
            'brands.*',
            'brands.id as brand_id',
            'categories.*',
            "categories.id as category_id",
            "products_price.*",
            "products_price.id as products_price_id",
            "product_inventory.*",
            "product_inventory.id as product_inventory_id",
            "product_seo.*",
            "product_seo.id as product_seo_id",
            "product_badge.*",
            "product_badge.id as product_badge_id",
            "product_category.*",
            "product_category.id as product_category_id",
            "related_products.*",
            "related_products.id as related_product_id",


            db.raw(`
            jsonb_agg(
                jsonb_build_object(
                    'url', product_gallery.url,
                    'id', product_gallery.id,
                    'is_baseimage', product_gallery.is_baseimage
                )
            ) as product_img
        `),


        )

        .groupBy(
            'products.id',
            'brands.id',
            'categories.id',
            'products_price.id',
            'product_inventory.id',
            'product_seo.id',
            'product_badge.id',
            'product_category.id',
            'related_products.id',

        )



    return relatedProducts;
};




export const deleteARelatedProduct = async (relatedProductId) => {
    const deleted = await db('related_products')
        .where({ id: relatedProductId })
        .del();
    return deleted;
};



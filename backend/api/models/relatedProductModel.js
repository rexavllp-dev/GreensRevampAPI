import db from '../../config/dbConfig.js';
import { getPrdPrice } from './productPriceModel.js';

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
        .crossJoin('vat')
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
            "related_products.id as relatedProductId",



            db.raw(`
            CASE 
                WHEN products_price.is_discount = 'false' THEN products_price.product_price * (1 + vat.vat / 100)
                WHEN products_price.is_discount = true AND CURRENT_TIMESTAMP BETWEEN DATE(products_price.special_price_start) AND DATE(products_price.special_price_end) THEN
                    CASE 
                        WHEN products_price.special_price_type = 'percentage' THEN products_price.product_price * (1 - (products_price.special_price / 100)) * (1 + vat.vat / 100)
                        WHEN products_price.special_price_type = 'fixed' THEN (products_price.product_price - products_price.special_price) * (1 + vat.vat / 100)
                        ELSE 0
                    END
                ELSE products_price.product_price * (1 + vat.vat / 100)
            END AS compute_price
    `),


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
            'vat.id'

        )


    // Integrate getPrdPrice for each product
    const productsWithPrice = await Promise.all(relatedProducts.map(async (product) => {
        const prdPrice = await getPrdPrice(product.products_price_id);
        return { ...product, prdPrice };
    }));



    return {
        relatedProducts: productsWithPrice,
    }
};




export const deleteARelatedProduct = async (relatedProductId) => {
    const deleted = await db('related_products')
        .where({ id: relatedProductId })
        .del();
    return deleted;
};



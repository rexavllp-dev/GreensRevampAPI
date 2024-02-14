import db from '../../config/dbConfig.js';
import { DateTime } from 'luxon';
import { getPrdPrice } from './productPriceModel.js';

// get all products
export const getPublicProducts = async (page, per_page, search, filters, sort) => {

    const currentDateTime = DateTime.local(); // Get the current date and time
    let query = db('products')
        .leftJoin('brands', 'products.prd_brand_id', 'brands.id')
        .leftJoin('product_category', 'products.id', 'product_category.product_id')
        .leftJoin('categories', 'product_category.category_id', 'categories.id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .leftJoin('product_seo', 'products.id', 'product_seo.product_id')
        .leftJoin('product_badge', 'products.id', 'product_badge.product_id')


        .select(
            'products.*',
            'products.created_at as product_created_at',
            'products.updated_at as product_updated_at',
            'brands.*',
            'brands.id as brand_id',
            'brands.created_at as brand_created_at',
            'brands.updated_at as brand_updated_at',
            'categories.*',
            "categories.id as category_id",
            "categories.created_at as category_created_at",
            "categories.updated_at as category_updated_at",
            "products_price.*",
            "products_price.id as products_price_id",
            'products_price.created_at as product_price_created_at',
            'products_price.updated_at as product_price_updated_at',
            "product_inventory.*",
            "product_inventory.id as product_inventory_id",
            "product_inventory.created_at as product_inventory_created_at",
            "product_inventory.updated_at as product_inventory_updated_at",
            "product_seo.*",
            "product_seo.id as product_seo_id",
            "product_seo.created_at as product_seo_created_at",
            "product_seo.updated_at as product_seo_updated_at",
            "product_badge.*",
            "product_badge.id as product_badge_id",
            "product_category.*",
            "product_category.id as product_category_id",
            "product_category.created_at as product_category_created_at",
            "product_category.updated_at as product_category_updated_at",


            db.raw(`
            jsonb_agg(
                jsonb_build_object(
                    'url', product_gallery.url,
                    'id', product_gallery.id,
                    'is_baseimage', product_gallery.is_baseimage
                )
            ) as product_img
        `),

            db.raw('COALESCE(products_price.special_price, products_price.product_price) as computed_price'),

        )
        .distinct('products.id')
        .groupBy(
            'products.id',
            'brands.id',
            'categories.id',
            'products_price.id',
            'product_inventory.id',
            'product_seo.id',
            'product_badge.id',
            'product_category.id',


        )
        .whereNull('products.deleted_at')
        .where('products.prd_status', true);

    // Modify the query to only include products with an active special price based on the current date and time
    query.where(function () {
        this.whereNull('products_price.special_price_start') // special price start is null
            .orWhere('products_price.special_price_start', '<=', currentDateTime.toISO()) // special price start is in the past or now
            .whereNull('products_price.special_price_end') // special price end is null
            .orWhere('products_price.special_price_end', '>=', currentDateTime.toISO()); // special price end is in the future or now
    });

    if (search) {
        console.log(search);
        query.where(function () {
            this.whereRaw(`similarity(products.prd_name, ?) > 0.2`, [search]) // Search similarity in product name
                .orWhereRaw(`similarity(product_inventory.sku, ?) > 0.2`, [search]); // Search similarity in SKU
        });
    };

    // Apply complex filters

    filters.forEach(filter => {
        console.log("filters", filters);
        console.log("filter", filter);
        if (filter.operator === '>') {
            query.where(filter.column, '>', filter.value);
        }
        if (filter.operator === '<') {
            query.where(filter.column, '<', filter.value);
        }
        if (filter.operator === '=') {
            query.where(filter.column, '=', filter.value);
        }
    });


    // Sorting by price
    if (sort === 'price_asc') {
        query.orderByRaw('COALESCE(products_price.special_price, products_price.product_price) ASC');
    } else if (sort === 'price_desc') {
        query.orderByRaw('COALESCE(products_price.special_price, products_price.product_price) DESC');
    } else if (sort === 'newest') {
        query.orderBy('products.created_at', 'desc'); //  'created_at' is the creation timestamp of products
    } else if (sort === 'oldest') {
        query.orderBy('products.created_at', 'asc');
    } else if (sort === 'featured') {
        query.orderBy('product_badge.is_featured', 'desc');
    };


    // Sorting by featured products
    //  if (sortFeatured) {
    //     query.orderBy('product_badge.id', 'asc'); // Assuming featured products are identified by the presence of badges
    // };

    const totalCountQuery = query.clone().clearSelect().countDistinct('products.id as total');

    // pagination 
    if (per_page && page) {
        const limit = per_page;
        const offsetValue = (page - 1) * per_page;
        query.limit(limit)
            .offset(offsetValue)
    }



    const [products, totalCountResult] = await Promise.all([query, totalCountQuery]);

    return {
        products: products,
        totalCount: totalCountResult[0],
        totalPage: Math.ceil(totalCountResult[0]?.total / per_page),
        per_page: per_page,
        page: page
    }

};




export const getPublicProductById = async (productId) => {
    const products = await db('products')
        .select(
            'products.*',
            'brands.*',
            'brands.id as brand_id',
            'categories.*',
            'categories.id as category_id',
            'products_price.*',
            'products_price.id as products_price_id',
            'product_inventory.*',
            'product_inventory.id as product_inventory_id',
            'product_seo.*',
            'product_seo.id as product_seo_id',
            'product_badge.*',
            'product_badge.id as product_badge_id',
            'product_category.*',
            'product_category.id as product_category_id',
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
        .from('products')
        .leftJoin('brands', 'products.prd_brand_id', 'brands.id')
        .leftJoin('product_category', 'products.id', 'product_category.product_id')
        .leftJoin('categories', 'product_category.category_id', 'categories.id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .leftJoin('product_seo', 'products.id', 'product_seo.product_id')
        .leftJoin('product_badge', 'products.id', 'product_badge.product_id')
        .where('products.id', productId)
        .andWhere('products.prd_status', true) // Add condition for product status
        .whereNull('products.deleted_at')
        .groupBy(
            'products.id',
            'brands.id',
            'categories.id',
            'products_price.id',
            'product_inventory.id',
            'product_seo.id',
            'product_badge.id',
            'product_category.id'
        )
        .first();

    return products;

};



export const getAllRelatedProductsByProductId = async (productId) => {
    let query = db('products')
        .leftJoin('brands', 'products.prd_brand_id', 'brands.id')
        .leftJoin('product_category', 'products.id', 'product_category.product_id')
        .leftJoin('categories', 'product_category.category_id', 'categories.id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .leftJoin('product_seo', 'products.id', 'product_seo.product_id')
        .leftJoin('product_badge', 'products.id', 'product_badge.product_id')
        .leftJoin('related_products', 'products.id', 'related_products.product_id')
        .where('related_products.product_id', productId)



        .select(
            'products.*',
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

            db.raw('COALESCE(products_price.special_price, products_price.product_price) as computed_price'),

        )
        .distinct('products.id')
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
        .whereNull('products.deleted_at')



    const totalCountQuery = query.clone().clearSelect().countDistinct('products.id as total');

    // // pagination 
    // if (per_page && page) {
    //     const limit = per_page;
    //     const offsetValue = (page - 1) * per_page;
    //     query.limit(limit)
    //         .offset(offsetValue)
    // }



    const [products, totalCountResult] = await Promise.all([query, totalCountQuery]);


    // Integrate getPrdPrice for each product
    const productsWithPrice = await Promise.all(products.map(async (product) => {
        const prdPrice = await getPrdPrice(product.products_price_id);
        return { ...product, prdPrice };
    }));

    return {
        products: productsWithPrice,
        totalCount: totalCountResult[0],
        // totalPage: Math.ceil(totalCountResult[0]?.total / per_page),
        // per_page: per_page,
        // page: page
    }

};
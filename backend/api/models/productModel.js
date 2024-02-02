import db from '../../config/dbConfig.js';
import { DateTime } from 'luxon';

// create product
export const createAProduct = async (productData) => {
    const newProduct = await db("products").insert(productData).returning('*');
    return newProduct;
};


// update product

export const updateAProduct = async (productId, updatedData) => {
    const updatedProduct = await db('products').where({ id: productId })
        .update(updatedData)
        .returning('*'); // Return the updated product
    return updatedProduct;
}

// get a product
// export const getProductById = async (productId) => {
//     const currentDateTime = DateTime.local(); // Get the current date and time
//     const products =  db('products')
//         .select(
//             'products.*',
//             'brands.*',
//             'brands.id as brand_id',
//             'categories.*',
//             'categories.id as category_id',
//             'products_price.*',
//             'products_price.id as products_price_id',
//             'product_inventory.*',
//             'product_inventory.id as product_inventory_id',
//             'product_seo.*',
//             'product_seo.id as product_seo_id',
//             'product_badge.*',
//             'product_badge.id as product_badge_id',
//             'product_category.*',
//             'product_category.id as product_category_id',
//             "products_bulks.*",
//             "products_bulks.id as product_bulks_id",
//             db.raw(`
//             jsonb_agg(
//                 jsonb_build_object(
//                     'url', product_gallery.url,
//                     'id', product_gallery.id,
//                     'is_baseimage', product_gallery.is_baseimage
//                 )
//             ) as product_img
//         `)
//         ,
//             db.raw(`
//             jsonb_agg(
//                 jsonb_build_object(
//                     'id', products_bulks.id,
//                     'product_id', products_bulks.product_id,
//                     'start_range', products_bulks.start_range,
//                     'end_range', products_bulks.end_range,
//                     'discounted_price', products_bulks.discounted_price
//                 )
//             ) as bulk_options
//         `)
//         )
//         .from('products')
//         .leftJoin('brands', 'products.prd_brand_id', 'brands.id')
//         .leftJoin('product_category', 'products.id', 'product_category.product_id')
//         .leftJoin('categories', 'product_category.category_id', 'categories.id')
//         .leftJoin('products_price', 'products.id', 'products_price.product_id')
//         .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
//         .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
//         .leftJoin('product_seo', 'products.id', 'product_seo.product_id')
//         .leftJoin('product_badge', 'products.id', 'product_badge.product_id')
//         .leftJoin('products_bulks', 'products.id', 'products_bulks.product_id')
//         .where('products.id', productId)
//         .whereNull('products.deleted_at')
//         .groupBy(
//             'products.id',
//             'brands.id',
//             'categories.id',
//             'products_price.id',
//             'product_inventory.id',
//             'product_seo.id',
//             'product_badge.id',
//             'product_category.id',
//             'products_bulks.id'
//         )

//     // Modify the query to only include products with an active special price based on the current date and time
//     .where(function () {
//         this.whereNull('products_price.special_price_start') // special price start is null
//             .orWhere('products_price.special_price_start', '<=', currentDateTime.toISO()) // special price start is in the past or now
//             .whereNull('products_price.special_price_end') // special price end is null
//             .orWhere('products_price.special_price_end', '>=', currentDateTime.toISO()); // special price end is in the future or now
//     }).first()


//     if (products) {
//         // Retrieve bulk options separately since they are aggregated in the query
//         const bulkOptions = await db('products_bulks')
//             .select('*')
//             .where('product_id', productId);

//         // Assign bulk options to the product
//         products.bulk_options = bulkOptions;
//     }
//     return products;
// };

export const getProductById = async (productId) => {
    const currentDateTime = DateTime.local(); // Get the current date and time
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
            "products_bulks.*",
            "products_bulks.id as product_bulks_id",
            db.raw(`
            jsonb_agg(
                jsonb_build_object(
                    'url', product_gallery.url,
                    'id', product_gallery.id,
                    'is_baseimage', product_gallery.is_baseimage
                )
            ) as product_img
        `)
            ,
            db.raw(`
            jsonb_agg(
                jsonb_build_object(
                    'id', products_bulks.id,
                    'product_id', products_bulks.product_id,
                    'start_range', products_bulks.start_range,
                    'end_range', products_bulks.end_range,
                    'discounted_price', products_bulks.discounted_price
                )
            ) as bulk_options
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
        .leftJoin('products_bulks', 'products.id', 'products_bulks.product_id')
        .where('products.id', productId)
        .whereNull('products.deleted_at')
        .groupBy(
            'products.id',
            'brands.id',
            'categories.id',
            'products_price.id',
            'product_inventory.id',
            'product_seo.id',
            'product_badge.id',
            'product_category.id',
            'products_bulks.id'
        )

        // Modify the query to only include products with an active special price based on the current date and time
        .where(function () {
            this.whereNull('products_price.special_price_start') // special price start is null
                .orWhere('products_price.special_price_start', '<=', currentDateTime.toISO()) // special price start is in the past or now
                .whereNull('products_price.special_price_end') // special price end is null
                .orWhere('products_price.special_price_end', '>=', currentDateTime.toISO()); // special price end is in the future or now
        }).first()


    if (products) {
        // Retrieve bulk options separately since they are aggregated in the query
        const bulkOptions = await db('products_bulks')
            .select('*')
            .where('product_id', productId);

        // Assign bulk options to the product
        products.bulk_options = bulkOptions;
    }
    return products;
};

// get all products

export const getAllProducts = async (page, per_page, search, filters, sort) => {
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
        .whereNull('deleted_at')

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
        if (filter.column === 'computed_price') {
            // Check if the filter is applied on the computed price
            if (filter.operator === '>') {
                // Apply filter for computed price greater than the filter value
                query.havingRaw('COALESCE(products_price.special_price, products_price.product_price) > ?', [filter.value]);
            } else if (filter.operator === '<') {
                // Apply filter for computed price less than the filter value
                query.havingRaw('COALESCE(products_price.special_price, products_price.product_price) < ?', [filter.value]);
            } else if (filter.operator === '=') {
                // Apply filter for computed price equal to the filter value
                query.havingRaw('COALESCE(products_price.special_price, products_price.product_price) = ?', [filter.value]);
            }
        } else {
            // Apply other filters normally
            if (filter.operator === '>') {
                query.where(filter.column, '>', filter.value);
            } else if (filter.operator === '<') {
                query.where(filter.column, '<', filter.value);
            } else if (filter.operator === '=') {
                query.where(filter.column, '=', filter.value);
            }
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

// delete product

export const deleteAProduct = async (productId) => {
    const deletedProduct = await db('products')
        .where({ id: productId })
        .update({ deleted_at: db.fn.now() });

    return deletedProduct;
};



// ____________________________________________________________________________________________________________________________________________________________________________
// upload images

export const createProductGallery = async (data) => {
    const images = db('product_gallery').insert(data).returning('*');
    return images;
};

// get image 
export const getProductGalleryByProductId = async (productId) => {
    const images = db('product_gallery').where({ product_id: productId }).select('*');
    return images;
};


export const deleteProductImageById = async (imageId) => {
    const deletedImage = await db('product_gallery').where({ id: imageId }).del();
    return deletedImage;
}


export const getSortedProducts = async (sortBy) => {
    let query;

    switch (sortBy) {
        case 'priceLowToHigh':
            query = db.select().from('products').orderBy('prd_price', 'asc');
            break;
        case 'priceHighToLow':
            query = db.select().from('products').orderBy('prd_price', 'desc');
            break;
        case 'alphabeticalAZ':
            query = db.select().from('products').orderBy('prd_name', 'asc');
            break;
        case 'alphabeticalZA':
            query = db.select().from('products').orderBy('prd_name', 'desc');
            break;
        default:
            query = db.select().from('products');
            break;
    };

    const products = await query;
    return products;

};


// ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
// get products by category
export const getProductsByCategory = async (page, per_page, search, filters, categoryId) => {
    let query = db('products')
        .leftJoin('brands', 'products.prd_brand_id', 'brands.id')
        .leftJoin('product_category', 'products.id', 'product_category.product_id')
        .leftJoin('categories', 'product_category.category_id', 'categories.id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .leftJoin('product_seo', 'products.id', 'product_seo.product_id')
        .leftJoin('product_badge', 'products.id', 'product_badge.product_id')
        .where({ 'categories.id': categoryId })
        .select(
            'products.*',
            'brands.*',
            'brands.id as brand_id',
            'categories.*',
            "categories.id as category_id",
            "products_price.*",
            "products_price.id as products_price_id",
            "product_gallery.*",
            "product_gallery.id as product_gallery_id",
            "product_inventory.*",
            "product_inventory.id as product_inventory_id",
            "product_seo.*",
            "product_seo.id as product_seo_id",
            "product_badge.*",
            "product_badge.id as product_badge_id",
            "product_category.*",
            "product_category.id as product_category_id",

        )
        .distinct('products.id');

    if (search) {
        console.log(search)
        query.where("products.prd_name", "ilike", `%${search}%`);
    }

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

    return query;
};


export const saveImageUrl = async (productId, imageUrl) => {
    return db('products')
        .where('id', productId)
        .update({ image_url: imageUrl });
};

// ____________________________________________________________________________________________________________________________________________________________________________


export const fetchAllOptionProducts = async (page, per_page, search, filters, sort) => {
    let query = db('products')
        .leftJoin('brands', 'products.prd_brand_id', 'brands.id')
        .leftJoin('product_category', 'products.id', 'product_category.product_id')
        .leftJoin('categories', 'product_category.category_id', 'categories.id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .leftJoin('product_seo', 'products.id', 'product_seo.product_id')
        .leftJoin('product_badge', 'products.id', 'product_badge.product_id')
        .leftJoin('product_options', 'products.id', 'product_options.product_id')
        .whereNull('product_options.product_id')


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
            "product_options.*",
            "product_options.id as product_options_id",

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
            'product_options.id',

        )
        .whereNull('deleted_at');

    if (search) {
        console.log(search);
        query.whereRaw(`similarity(products.prd_name, ?) > 0.2`, [search]);
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
        query.orderBy('products_price.product_price', 'asc');
    } else if (sort === 'price_desc') {
        query.orderBy('products_price.product_price', 'desc');
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





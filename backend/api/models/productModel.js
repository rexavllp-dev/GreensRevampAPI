import db from '../../config/dbConfig.js';

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
export const getProductById = async (productId) => {
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

// get all products

export const getAllProducts = async (page, per_page, search, filters) => {
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
        );

    if (search) {
        console.log(search);
        query.whereRaw(`similarity(products.prd_name, ?) > 0.2`, [search]);
        
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
    const deletedProduct = await db('products').where({ id: productId }).del();
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






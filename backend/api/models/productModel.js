import { query } from 'express';
import db from '../../config/dbConfig.js';

// create product

export const createAProduct = async (productData) => {
    const newUser = await db("products").insert(productData).returning('*');
    return newUser;
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
    const product = await db('products')
        .select('*')
        .where({ id: productId })
        .first();

    return product;
}

// get all products

export const getAllProducts = async (page, per_page, search, filters) => {
    let query =  db('products')
        .join('brands', 'products.prd_brand_id', 'brands.id')
        .join('product_category', 'products.id', 'product_category.product_id')
        .join('categories', 'product_category.category_id', 'categories.id')
        .select(
            'products.*',
            'brands.*',
            'categories.*'
        );

    if (search) {
console.log(search)
        query.where("products.prd_name", "ilike", `%${search}%`);
    }

    // Apply complex filters
   
    filters.forEach(filter => {
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
}

// delete product

export const deleteAProduct = async (productId) => {
    const deletedProduct = await db('products').where({ id: productId }).del();
    return deletedProduct;
}



// ____________________________________________________________________________________________________________________________________________________________________________
// upload images

export const createProductGallery = async (data) => {
    console.log("data", data);
    const images = db('product_gallery').insert(data).returning('*');
    return images;
};

// get image 
export const getProductGalleryByProductId = async (productId) => {
    const images = db('product_gallery').where({ product_id: productId }).select('*');
    return images;
};


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

}

// ____________________________________________________________________________________________________________________________________________________________________________


                                                 
    


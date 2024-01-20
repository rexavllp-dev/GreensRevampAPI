import db from '../../config/dbConfig.js';

// get all products
export const getPublicProducts = async () => {
   
    const products = await db('products')
        .select('products.*',
            'product_gallery.*',
            'products_price.*',
        )
        .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .where('products.status', 'public')
        .distinct('products.id');
        
    return products;
}
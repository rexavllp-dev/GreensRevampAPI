import db from '../../config/dbConfig.js';


// create review
export const addReview = async (userId, reviewData) => {
    const newReview = await db('product_reviews')
        .insert({
            user_id: userId,
            ...reviewData
        })
        .returning('*')
    return newReview;
};


export const getUserPurchases = async (userId, productId) => {
    console.log(userId, productId);


    const userOrders = await db('user_orders')
        .select('user_orders.id')
        .where('user_orders.customer_id', userId);


    const orderIds = userOrders.map(order => order.id);


    const orderItems = await db('order_items')
        .select('order_items.product_id')
        .whereIn('order_items.order_id', orderIds);

    // Extract the product IDs
    const productIds = orderItems.map(item => item.product_id);


    // Check if the specified product is among the user's purchased products
    const hasPurchasedProduct = productIds.includes(productId);

    return hasPurchasedProduct;

};

// get all reviews

export const getsAllReviewsByProductId = async (productId) => {
    const reviews = await db('products')

        .leftJoin('product_reviews', 'products.id', 'product_reviews.product_id')
        .leftJoin('users', 'product_reviews.user_id', 'users.id')

        .where({ 'products.id': productId })
        .where({ 'product_reviews.is_approved': true })
        .select(

            'users.usr_firstname',
            'users.usr_lastname',

            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.created_at',

        );
    return reviews;
};





// admin review

// method to approve a review by an admin
export const approveReview = async (reviewId, reviewData) => {

    const approvedReview = await db('product_reviews')
        .where({ id: reviewId })
        .update(reviewData)
        .returning('*')

    return approvedReview;
};



// get all reviews for admin 
export const getAllReviewsAdmin = async () => {

    const reviews = await db('product_reviews')
        .leftJoin('users', 'users.id', 'product_reviews.user_id')
        .leftJoin('products', 'products.id', 'product_reviews.product_id')

        .select(

            'product_reviews.id as reviewId',
            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.is_approved',
            'product_reviews.created_at as createdAt',

            'products.prd_name',

            'users.usr_firstname',
            'users.usr_lastname',



        );

    return reviews;

};

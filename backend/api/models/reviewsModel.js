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


// review image
export const addReviewImage = async (reviewId, imageUrl) => {
    await db('review_gallery').insert({
        review_id: reviewId,
        url: imageUrl
    });
};



// update the review by user 
export const updateReviewByUser = async (reviewId, reviewData) => {

    const updateReview = await db('product_reviews')
        .where({ id: reviewId })
        .update(reviewData)
        .returning('*')

    return updateReview;

}


// get all user reviews by userId
export const getsAllReviewsByUserId = async (userId, sortBy) => {
    let reviews =  db('products')

        .leftJoin('product_reviews', 'products.id', 'product_reviews.product_id')
        .leftJoin('review_gallery', 'product_reviews.id', 'review_gallery.review_id')
        .leftJoin('users', 'product_reviews.user_id', 'users.id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('review_likes_dislikes', 'product_reviews.id', 'review_likes_dislikes.review_id')

        .where({ 'users.id': userId })
        .where({ 'product_reviews.is_approved': true })
        .select(


            'users.usr_firstname',
            'users.usr_lastname',

            'products.prd_name',
            'products.image_url',

            'products_price.product_price',

            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.created_at',



            db.raw('COUNT(CASE WHEN review_likes_dislikes.action = \'like\' THEN 1 ELSE NULL END) AS likes'),
            db.raw('COUNT(CASE WHEN review_likes_dislikes.action = \'dislike\' THEN 1 ELSE NULL END) AS dislikes'),

            db.raw(`jsonb_agg(jsonb_build_object('id', review_gallery.id, 'url', review_gallery.url)) AS reviewImages`)

        )

        .groupBy(

            'product_reviews.id',

            'users.usr_firstname',
            'users.usr_lastname',

            'products.prd_name',
            'products.image_url',

            'products_price.product_price',

            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.created_at',

        );

        if (sortBy === 'recent') {
            reviews = reviews.orderBy('product_reviews.created_at', 'desc');
        } else if (sortBy === 'useful') {
            reviews = reviews.orderBy(db.raw('COUNT(CASE WHEN review_likes_dislikes.action = \'like\' THEN 1 ELSE NULL END)'), 'desc');
        } else if (sortBy === 'low_to_high') {
            reviews = reviews.orderBy('product_reviews.rating', 'asc');
        } else if (sortBy === 'high_to_low') {
            reviews = reviews.orderBy('product_reviews.rating', 'desc');
        }
    
    



    return reviews;
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
        .leftJoin('review_likes_dislikes', 'product_reviews.id', 'review_likes_dislikes.review_id')

        .where({ 'products.id': productId })
        .where({ 'product_reviews.is_approved': true })
        .select(

            'users.usr_firstname',
            'users.usr_lastname',

            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.created_at',

            db.raw('COUNT(CASE WHEN review_likes_dislikes.action = \'like\' THEN 1 ELSE NULL END) AS likes'),
            db.raw('COUNT(CASE WHEN review_likes_dislikes.action = \'dislike\' THEN 1 ELSE NULL END) AS dislikes'),
            db.raw('CAST(COUNT(product_reviews.rating) AS FLOAT) AS total_ratings')

        )

        .groupBy(
            'product_reviews.id',

            'users.usr_firstname',
            'users.usr_lastname',

            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.created_at'
        );

    
    const totalRatings = parseFloat(reviews.reduce((acc, review) => acc + review.total_ratings, 0));
   
    // Calculate average rating
    let averageRating = totalRatings > 0 ? parseFloat(reviews.reduce((acc, review) => acc + review.rating, 0) / totalRatings) : 0;
    averageRating = parseFloat(averageRating.toFixed(1));



    return {
        reviews,
        totalRatings,
        averageRating
    };
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


export const likeOrDislikeReview = async (userId, reviewId, action) => {
    const actions = await db('review_likes_dislikes')
        .insert({
            user_id: userId,
            review_id: reviewId,
            action: action
        });

    return actions
};

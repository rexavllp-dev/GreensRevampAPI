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
    console.log(reviewId, imageUrl);
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

};


// get all user reviews by userId
export const getsAllReviewsByUserId = async (userId, sortBy, page, perPage) => {

    let reviews = db('products')

        .leftJoin('product_reviews', 'products.id', 'product_reviews.product_id')
        .leftJoin('review_gallery', 'product_reviews.id', 'review_gallery.review_id')
        .leftJoin('users', 'product_reviews.user_id', 'users.id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('review_likes_dislikes', 'product_reviews.id', 'review_likes_dislikes.review_id')

        .where({ 'users.id': userId })
        .where({ 'product_reviews.is_approved': true })

        .select(
            'product_reviews.id as reviewId',
            'users.usr_firstname',
            'users.usr_lastname',

            'products.prd_name',
            'products.image_url',

            'products_price.product_price',

            'product_reviews.review',
            'product_reviews.heading_review',
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
    };


    const offset = (page - 1) * perPage;
    const review = await reviews.offset(offset).limit(perPage);


    return review;

};



export const getUserPurchases = async (userId, productId) => {
    console.log(userId, productId);

    const userOrders = await db('user_orders')
        .select('user_orders.*')
        .leftJoin('order_items', 'user_orders.id', 'order_items.order_id') // Joining order_items with user_orders
        .where('user_orders.customer_id', userId)
        .andWhere('order_items.product_id', productId); // Filtering based on product_id

    if (userOrders.length > 0) {
        return true;
    } else {
        return false;
    }
};

// get all reviews

export const getsAllReviewsByProductId = async (productId) => {
    const reviews = await db('product_reviews')

        .leftJoin('products', 'product_reviews.product_id', 'products.id')
        .leftJoin('review_gallery', 'product_reviews.id', 'review_gallery.review_id')
        .leftJoin('users', 'product_reviews.user_id', 'users.id')
        .leftJoin('review_likes_dislikes', 'product_reviews.id', 'review_likes_dislikes.review_id')

        .where({ 'product_reviews.product_id': productId })
        .where({ 'product_reviews.is_approved': true })
        .select(

            'users.usr_firstname',
            'users.usr_lastname',

            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.heading_review',
            'product_reviews.created_at',

            db.raw('COUNT(CASE WHEN review_likes_dislikes.action = \'like\' THEN 1 ELSE NULL END) AS likes'),
            db.raw('COUNT(CASE WHEN review_likes_dislikes.action = \'dislike\' THEN 1 ELSE NULL END) AS dislikes'),
            db.raw('CAST(COUNT(product_reviews.rating) AS FLOAT) AS total_ratings'),

            db.raw(`jsonb_agg(jsonb_build_object('id', review_gallery.id, 'url', review_gallery.url)) AS reviewImages`)

        )

        .groupBy(

            'product_reviews.id',

            'users.usr_firstname',
            'users.usr_lastname',

            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.heading_review',
            'product_reviews.created_at'
        );

    // Count total ratings (total number of reviews)
    const totalRatings = reviews.length;


    // const totalRatings = parseFloat(reviews.reduce((acc, review) => acc + review.total_ratings, 0));

    // Calculate average rating
    let averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalRatings;
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
export const getAllReviewsAdmin = async (sortBy, page, perPage) => {


    let reviews = db('product_reviews')
        .leftJoin('users', 'users.id', 'product_reviews.user_id')
        .leftJoin('products', 'products.id', 'product_reviews.product_id')
        .leftJoin('review_gallery', 'product_reviews.id', 'review_gallery.review_id')

        .select(

            'product_reviews.id as reviewId',
            'product_reviews.review',
            'product_reviews.heading_review',
            'product_reviews.rating',
            'product_reviews.is_approved',
            'product_reviews.created_at as createdAt',


            'products.prd_name',

            'users.usr_firstname',
            'users.usr_lastname',

            db.raw(`jsonb_agg(jsonb_build_object('id', review_gallery.id, 'url', review_gallery.url)) AS reviewImages`)

        )

        .groupBy(

            'product_reviews.id',
            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.is_approved',
            'product_reviews.created_at',



            'products.prd_name',

            'users.usr_firstname',
            'users.usr_lastname'
        )


    if (sortBy === 'recent') {
        reviews = reviews.orderBy(['product_reviews.created_at', 'product_reviews.updated_at'], 'desc');
    };

    const offset = (page - 1) * perPage;
    const review = await reviews.offset(offset).limit(perPage);

    return review;

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



export const getSingleReviewByReviewId = async (reviewId) => {

    let reviews = await db('product_reviews')
        .where({ 'product_reviews.id': reviewId })
        .leftJoin('users', 'users.id', 'product_reviews.user_id')
        .leftJoin('products', 'products.id', 'product_reviews.product_id')
        .leftJoin('review_gallery', 'product_reviews.id', 'review_gallery.review_id')
        .leftJoin('product_gallery', 'products.id', 'product_gallery.product_id')
        .select(
            'product_reviews.id as reviewId',
            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.is_approved',
            'product_reviews.created_at as createdAt',
            'products.prd_name',
            'users.usr_firstname',
            'users.usr_lastname',

            db.raw(`jsonb_agg(distinct jsonb_build_object('id', review_gallery.id, 'url', review_gallery.url)) AS reviewImages`),

            db.raw(`jsonb_agg(distinct jsonb_build_object('id', product_gallery.id, 'url', product_gallery.url)) AS productImages`)
        )
        .groupBy(
            'product_reviews.id',
            'product_reviews.review',
            'product_reviews.rating',
            'product_reviews.is_approved',
            'product_reviews.created_at',
            'products.prd_name',
            'users.usr_firstname',
            'users.usr_lastname'
        );

    return reviews;
};




export const deleteAReviewImages = async (reviewGalleryId) => {
    const deleteReviewImages = await db('review_gallery')
        .where({ id: reviewGalleryId })
        .del();

    return deleteReviewImages;
};
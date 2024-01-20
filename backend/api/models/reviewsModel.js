import db from '../../config/dbConfig.js';


// create review
export const addReview = async (reviewData) => {

    const newReview = await db('product_reviews').insert(reviewData).returning('*')
    return newReview;
}


// get all reviews

export const getAllReviews = async () => {

     const reviews = await db('product_reviews').select('*');
        return reviews;

}

// method to approve a review by an admin

export const approveReview = async (reviewId) => {

    const approvedReview = await db('product_reviews').where({ id: reviewId })
    .update({is_approved: true}).returning('*')
    return approvedReview;
}


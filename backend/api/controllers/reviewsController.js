import { approveReview } from "../models/reviewsModel.js";


export const addProductReview = async (req, res) => {

    const reviewData = req.body;

    try {
        const newReview = await addReview(reviewData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Review created successfully",
            result: newReview
        })

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create review",
            error: error
        });
    }
}



// method to approve a review by an admin

export const approveReviewByAdmin = async (req, res) => {

    const { reviewId } = req.body;

    try {

        const approvedReview = await approveReview(reviewId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Review approved successfully",
            result: approvedReview  
        })
    } catch (error) {

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to approve review",
            error: error
        });
    }

}


// method to get all reviews

export const getAllReviews = async (req, res) => {

    try {

        const reviews = await getAllReviews();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Reviews fetched successfully",
            result: reviews
        })

} catch(error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get reviews",
            error: error
        });
    }

}



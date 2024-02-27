import { addReview, approveReview, getAllReviewsAdmin, getUserPurchases, getsAllReviewsByProductId } from "../models/reviewsModel.js";


export const addProductReview = async (req, res) => {

    const reviewData = req.body;
    const userId = req.user.userId;

    try {

        const userPurchases = await getUserPurchases(2, reviewData.product_id);

        if (!userPurchases || userPurchases.length === 0) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "Sorry! You are not allowed to review this product since you haven't bought it on Greeens International",
            });
        };

        const newReview = await addReview(userId, reviewData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Thank you so much. Your review has been saved",
            result: newReview
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create review",
            error: error
        });
    }
};



// method to get all reviews
export const getAllProductReviews = async (req, res) => {

    const productId = req.params.productId;

    try {

        const reviews = await getsAllReviewsByProductId(productId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Reviews fetched successfully",
            result: reviews
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get reviews",
            error: error
        });
    }

}



// Admin Reviews Handler
// method to approve a review by an admin
export const approveReviewByAdmin = async (req, res) => {

    const reviewData = req.body;
    const reviewId = req.params.reviewId;

    try {

        const approvedReview = await approveReview(reviewId, reviewData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Review approved successfully",
            result: approvedReview
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to approve review",
            error: error
        });
    }

};



// get all reviews for admin
export const getAllReviewsForAdmin = async (req, res) => {
    try {
        const reviews = await getAllReviewsAdmin();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Reviews fetched successfully",
            result: reviews
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to approve review",
            error: error
        });

    }
};



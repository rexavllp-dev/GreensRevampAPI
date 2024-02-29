import { addReview, addReviewImage, approveReview, getAllReviewsAdmin, getUserPurchases, getsAllReviewsByProductId, getsAllReviewsByUserId, likeOrDislikeReview, updateReviewByUser } from "../models/reviewsModel.js";
import sharp from "sharp";
import aws from 'aws-sdk';



const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig);




// user reviews controller
export const addProductReview = async (req, res) => {

    const reviewData = req.body;
    const userId = req.user.userId;
    let files = req.files?.files;

    try {


        if (!files?.length) {
            files = [];
        }

        let reviewImages = [];



        reviewData.rating = parseFloat(reviewData.rating);
        const productId = parseInt(reviewData.product_id);


        const userPurchases = await getUserPurchases(1, productId);

        if (!userPurchases || userPurchases.length === 0) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "Sorry! You are not allowed to review this product since you haven't bought it on Greeens International",
            });
        };

        const newReview = await addReview(userId, reviewData);
        const reviewId = newReview[0].id;




        for (let i = 0; i < files?.length; i++) {
            const file = files[i];


            const resizedBuffer = await sharp(file.data)
                .resize({ width: 300, height: 300 })
                .toBuffer();

            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/${file.name}`,
                Body: resizedBuffer,
                ContentType: file.mimetype,
            };

            const s3Data = await s3.upload(uploadParams).promise();

            const imageUrl = s3Data.Location;

            await addReviewImage(reviewId, imageUrl);

            const imageDetails = {
                review_id: reviewId,
                url: s3Data.Location,
            };

            reviewImages.push(imageDetails);
        };

        console.log(reviewImages);


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

// update the review by user
export const updateUserReview = async (req, res) => {

    const reviewData = req.body;
    const reviewId = req.params.reviewId;

    try {
        const updatedReview = await updateReviewByUser(reviewId, reviewData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Updated review successfully",
            result: updatedReview
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update review",
            error: error
        });
    }
};


// get all reviews for user
export const getAllUserProductReviews = async (req, res) => {

    const userId = req.user.userId;
    const  {sortBy}  = req.query; 
    console.log(sortBy);

    try {

        const reviews = await getsAllReviewsByUserId(userId, sortBy);

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

};

// like dislike for product reviews
export const reviewLikeAndDislike = async (req, res) => {

    const userId = req.user.userId;
    const { reviewId, action } = req.body;

    try {
        const actions = await likeOrDislikeReview(userId, reviewId, action);

        res.status(200).json({
            status: 200,
            success: true,
            message: `Review ${action}d successfully`,

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to like or dislike review",
            error: error
        });
    }
};





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





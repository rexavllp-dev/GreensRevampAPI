
import { getsOrderByRecommendedProducts } from "../models/orderModel.js";
import { getUserRecommendedProducts } from "../models/searchHistoryModel.js";






export const getAllRecommendedProducts = async (req, res) => {

    const userId = req.user.userId;


    try {

        const recommendedProducts = await getUserRecommendedProducts(userId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Recommended products fetched successfully",
            result: recommendedProducts
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch recommended products",
            error: error
        });
    }

};






export const getAllOrderRecommendedProducts = async (req, res) => {

    try {

        const userId = req.user?.userId;


        const orderedProducts = await getsOrderByRecommendedProducts(userId);


        res.status(200).json({
            status: 200,
            success: true,
            message: "Recommended order products fetched successfully",
            result: orderedProducts
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch recommended order products",
            error: error
        });
    }
};

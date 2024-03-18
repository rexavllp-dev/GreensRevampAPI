import { getsAllExpiredProducts, getsAllLatestReplacementOrders, getsAllOutOfStockProducts, getsAllRecentOrders, getsLatestReturnedOrders } from "../models/adminDashBoardModel.js";




export const getAllRecentOrders = async (req, res) => {

    try {

        const recentOrders = await getsAllRecentOrders();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Recent orders fetched successfully",
            result: recentOrders
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch recent orders",
            error: error
        });
    }
};




export const getAllLatestReturn = async (req, res) => {

    try {

        const latestReturn = await getsLatestReturnedOrders();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Latest return fetched successfully",
            result: latestReturn
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch latest return",
            error: error
        });
    }
};




export const getAllLatestReplacement = async (req, res) => {

    try {

        const latestReplacement = await getsAllLatestReplacementOrders();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Latest replacement fetched successfully",
            result: latestReplacement
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch latest replacement",
            error: error
        });
    }
};




export const getAllOutOfStock = async (req, res) => {

    try {

        const outOfStock = await getsAllOutOfStockProducts();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Out of stock products fetched successfully",
            result: outOfStock
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch out of stock products",
            error: error
        });
    }

};



export const getAllExpiredProducts = async (req, res) => {

    try {

        const expiredProducts = await getsAllExpiredProducts();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Expired products fetched successfully",
            result: expiredProducts
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch expired products",
            error: error
        });
    }

};

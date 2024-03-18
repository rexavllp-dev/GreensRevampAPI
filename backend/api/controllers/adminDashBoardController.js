import { getsAllExpiredProducts, getsAllExpiredTradeLicenses, getsAllLatestReplacementOrders, getsAllOutOfStockProducts, getsAllProductsMinQty, getsAllRecentOrders, getsAllTotalOrders, getsLatestCancelledOrders, getsLatestReturnedOrders } from "../models/adminDashBoardModel.js";




export const getAllTotalOrders = async (req, res) => {

    try {

        const totalOrders = await getsAllTotalOrders();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Total orders fetched successfully",
            result: totalOrders
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch total orders",
            error: error
        });
    }
};





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




export const getAllLatestCancelledOrders = async (req, res) => {

    try {

        const latestCancelledOrders = await getsLatestCancelledOrders();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Latest cancelled orders fetched successfully",
            result: latestCancelledOrders
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch cancelled orders",
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




export const getAllProductsMinQty = async (req, res) => {

    try {

        const productQty = await getsAllProductsMinQty();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched products qty successfully",
            result: productQty
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch products qty",
            error: error
        });
    }

};





export const getAllExpiredTradeLicense = async (req, res) => {

    try {

        const productQty = await getsAllExpiredTradeLicenses();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched expired trade licenses successfully",
            result: productQty
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch expired trade licenses",
            error: error
        });
    }

};






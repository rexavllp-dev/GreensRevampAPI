import { getAllSearchKeywordCount, getProductCountByUser, getsAllBrandsReports, getsAllCancelledOrderReports, getsAllCouponReports, getsAllCustomerOrderCount, getsAllCustomerOrderReports, getsAllDeadStockReports, getsAllProductStockReports, getsAllReplaceReports, getsAllReturnReports, getsAllSearchReports } from "../models/reportsModel.js";




export const getAllCustomerOrderReports = async (req, res) => {
    try {

        const orders = await getsAllCustomerOrderReports();


        const orderCounts = await getsAllCustomerOrderCount();

        const productCounts = await getProductCountByUser();

        // store the total order count for each customer
        const orderCountMap = new Map();
        //  order counts and populate the map
        orderCounts.forEach(count => {
            orderCountMap.set(count.customer_id, count.total_orders);
        });


        const productCountMap = new Map();
        // product counts and populate the map
        productCounts.forEach(count => {
            productCountMap.set(count.customer_id, count.total_products);
        });


        // Merge order counts with order reports based on customer_id
        const mergedOrders = orders.map(order => {
            const totalOrders = orderCountMap.get(order.customer_id) || 0;
            const totalProducts = productCountMap.get(order.customer_id) || 0;
            return {
                ...order,
                total_orders: totalOrders,
                total_products: totalProducts
            };
        });

        // Remove duplicate entries for the same customer_id
        const uniqueOrders = mergedOrders.filter((order, index, self) =>
            index === self.findIndex(o => o.customer_id === order.customer_id)
        );

        res.status(200).json({
            status: 200,
            success: true,
            message: "Customer order reports fetched successfully",
            result: uniqueOrders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch customer order reports",
            error: error
        });
    }
};




export const getAllProductStocks = async (req, res) => {

    try {

        const products = await getsAllProductStockReports();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Product stocks fetched successfully",
            result: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch product stocks",
            error: error
        });
    }
};




export const getAllReturnReports = async (req, res) => {

    try {

        const products = await getsAllReturnReports();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Product return fetched successfully",
            result: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch product return",
            error: error
        });
    }
};




export const getAllReplaceReports = async (req, res) => {

    try {

        const products = await getsAllReplaceReports();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Product replace fetched successfully",
            result: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch product replace",
            error: error
        });
    }
};




export const getAllCancelReports = async (req, res) => {

    try {

        const orders = await getsAllCancelledOrderReports();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Cancelled order fetched successfully",
            result: orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch cancelled order",
            error: error
        });
    }
};



export const getAllSearchReports = async (req, res) => {

    try {

        const searchReports = await getsAllSearchReports();

        const keywordCounts = await getAllSearchKeywordCount();


        // Create a map to easily access keyword counts
        const keywordCountMap = {};
        keywordCounts.forEach(({ search_keyword, count }) => {
            keywordCountMap[search_keyword] = count;
        });


        const searchReportsWithCount = searchReports.map(report => ({
            ...report,
            count: keywordCountMap[report.search_keyword] || 0
        }));


        res.status(200).json({
            status: 200,
            success: true,
            message: "Search reports fetched successfully",
            result: searchReportsWithCount
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch search reports",
            error: error
        });
    }
};



export const getAllBrandReports = async (req, res) => {

    try {

        const brandReports = await getsAllBrandsReports();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Brand reports fetched successfully",
            result: brandReports
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch brand reports",
            error: error
        });
    }
};



export const getAllCouponReports = async (req, res) => {

    try {

        const couponReports = await getsAllCouponReports();

        res.status(200).json({
            status: 200,
            success: true,
            message: "coupon reports fetched successfully",
            result: couponReports
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch coupon reports",
            error: error
        });
    }
};



export const getDeadStockReports = async (req, res) => {

    try {

        const deadStockReports = await getsAllDeadStockReports();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Dead stock reports fetched successfully",
            result: deadStockReports
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch dead stock reports",
            result: ""
        });
    }

};
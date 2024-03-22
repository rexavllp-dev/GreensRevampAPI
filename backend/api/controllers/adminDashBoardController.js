import { getAllTotalSales, getsAllCompanyPendingApproval, getsAllExpiredProducts, getsAllExpiredTradeLicenses, getsAllLatestReplacementOrders, getsAllOutOfStockProducts, getsAllProductsMinQty, getsAllRecentOrders, getsAllTotalOrders, getsLatestCancelledOrders, getsLatestReturnedOrders } from "../models/adminDashBoardModel.js";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
dayjs.extend(utc);
dayjs.extend(timezone);




export const getAllTotalOrders = async (req, res) => {

   

    try {

        const { filter } = req.query;

        const totalOrders = await getsAllTotalOrders(filter);

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




// get all recent orders
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



// get all latest return

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


// get all latest replacement

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



// get all out of stock

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


// get all expired
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


// get all products min qty

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




// get all expired
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

// total sales  total revenue

export const getAllTotalSalesAmount = async (req, res) => {

    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    // fromDate = dayjs.utc(fromDate).utc(true).format();
    // toDate = dayjs.utc(toDate).utc(true).format();
    let filterBy = req.query.filterBy;

    console.log(req.query)

    // let uatOfferStartDate = new Date(fromDate);

    // uatOfferStartDate = uatOfferStartDate.toISOString().split('T')[0];
    // let uatOfferEndDate = new Date(toDate);

    // uatOfferEndDate = uatOfferEndDate.toISOString().split('T')[0];

    // fromDate = dayjs(fromDate).utcOffset('+05:30').format(); // Convert fromDate to IST
    // toDate = dayjs(toDate).utcOffset('+05:30').format(); // Convert toDate to IST

    if (filterBy === "today") {
        fromDate = dayjs().utcOffset('+05:30').format(); // Convert fromDate to IST
        toDate = dayjs().utcOffset('+05:30').format(); // Convert toDate to IST
    }

    if (filterBy === "week") {
        fromDate = dayjs().subtract(7, 'days').utcOffset('+05:30').format(); // Convert fromDate to IST
        toDate = dayjs().utcOffset('+05:30').format(); // Convert toDate to IST
        console.log("fromDate", fromDate, "toDate", toDate);    
    }

    if (filterBy === "month") {
        fromDate = dayjs().subtract(1, 'month').utcOffset('+05:30').format(); // Convert fromDate to IST
        toDate = dayjs().utcOffset('+05:30').format(); // Convert toDate to IST
    }

    if (filterBy === "year") {
        fromDate = dayjs().subtract(1, 'year').utcOffset('+05:30').format(); // Convert fromDate to IST
        toDate = dayjs().utcOffset('+05:30').format(); // Convert toDate to IST
    }

    if (filterBy === "custom") {

        console.log(filterBy);
        fromDate = dayjs(fromDate).utcOffset('+05:30').format(); // Convert fromDate to IST
        toDate = dayjs(toDate).utcOffset('+05:30').format(); // Convert toDate to IST

        // uatOfferStartDate= fromDate;
        // uatOfferEndDate= toDate;
        // fromDate = '2024-03-13'
        // toDate = '2024-03-19'
    }



    // get total sales and  date filter
    if (filterBy === "all") {
        fromDate = null
        toDate = null
    }


    try {


        const totalSales = await getAllTotalSales({

            fromDate,
            toDate
        });


        console.log(totalSales);


        res.status(200).json({
            status: 200,
            success: true,
            message: "Total sales fetched successfully",
            result: totalSales
        })
    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch total sales",
            error: error
        });
    }

}


// sales bar chart

export const getSalesBarChartData = async (req, res) => {


    try {

        const salesBarChartData = await getSalesBarChart();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Sales bar chart data fetched successfully",
            result: salesBarChartData
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch sales bar chart data",
        });
    }
};




export const getAllTotalCounts = async (req, res) => {

    try {

        // const totalOrders = await getsAllTotalOrders();
        const totalRecentOrders = await getsAllRecentOrders();
        const totalCanceledOrders = await getsLatestCancelledOrders();
        const totalReturnedOrders = await getsLatestReturnedOrders();
        const totalReplacementOrders = await getsAllLatestReplacementOrders();
        const totalOutOfStockProducts = await getsAllOutOfStockProducts();
        const totalExpiredProducts = await getsAllExpiredProducts();
        const totalProductsMinQty = await getsAllProductsMinQty();
        const totalExpiredTradeLicenses = await getsAllExpiredTradeLicenses();



        const totalCounts = {
            // totalOrders: totalOrders.pending_count + totalOrders.completed_count + totalOrders.canceled_count,
            totalRecentOrders: totalRecentOrders.totalCount,
            totalCanceledOrders: totalCanceledOrders.totalCount,
            totalReturnedOrders: totalReturnedOrders.totalCount,
            totalReplacementOrders: totalReplacementOrders.totalCount,
            totalOutOfStockProducts: totalOutOfStockProducts.totalCount,
            totalExpiredProducts: totalExpiredProducts.totalCount,
            totalProductsMinQty: totalProductsMinQty.totalCount,
            totalExpiredTradeLicenses: totalExpiredTradeLicenses.totalCount
        };


        res.status(200).json({
            status: 200,
            success: true,
            message: "Total counts fetched successfully",
            result: totalCounts
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch total counts",
            error: error
        });
    }
};



export const getAllCompanyPendingApprovals = async (req, res) => {

    try {

        const companyPendingApprovals = await getsAllCompanyPendingApproval();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Company pending approvals fetched successfully",
            result: companyPendingApprovals
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch company pending approvals",
            error: error
        });
    }
};





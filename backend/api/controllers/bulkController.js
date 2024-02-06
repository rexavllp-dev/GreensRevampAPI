import { approveBulkMaxOrder, bulkInsert, createBulkAbove, deleteBulk, existingBulk, getABulk, getAllBulk, getBulkAboveOrder, getBulkByProductId, getUserFromBulkOrder, isBulkOrderRequestExists, rejectBulkMaxOrder, saveBulkOrderRequest, updateBulk, updateBulkRequest } from "../models/bulkModel.js";
import { sendVerificationBulkApproved, sendVerificationBulkRejected } from "../utils/emailer.js";


export const createABulk = async (req, res) => {
    const bulkData = req.body;

    try {

        // Parse float for start_range and end_range
        bulkData.start_range = parseFloat(bulkData.start_range);
        bulkData.end_range = parseFloat(bulkData.end_range);

        // Check if start_range exceeds end_range or if it is not provided
        if (bulkData.start_range >= bulkData.end_range || isNaN(bulkData.start_range)) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid range values. Start range must be less than end range and should be provided.",
            });
        };

        // Check if start_range equals end_range and prompt admin to confirm
        if (bulkData.start_range === bulkData.end_range) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Start range equals end range. Please confirm if this is intended.",
            });
        };

        const existingRange = await existingBulk(bulkData);

        if (existingRange) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Bulk range already exists.",
            });
        }


        const newBulk = await bulkInsert(bulkData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Discount created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create discount",
            error: error
        });
    }
};


export const updateABulk = async (req, res) => {
    const bulkData = req.body;
    const bulkId = req.params.bulkId;
    try {
        const bulk = await updateBulk(bulkData, bulkId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Discount updated successfully",
            result: bulk
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update discount",
            error: error
        });
    }
};


export const getSingleBulk = async (req, res) => {
    const bulkId = req.params.bulkId;
    try {
        const bulk = await getABulk(bulkId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Discounts fetched successfully",
            result: bulk
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch discounts",
            error: error
        });
    }
};


export const getsAllBulks = async (req, res) => {
    try {
        const allBulks = await getAllBulk();
        res.status(200).json({
            status: 200,
            success: true,
            message: "Discounts fetched successfully",
            result: allBulks
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch discounts",
            error: error
        });
    }
};


export const deleteABulk = async (req, res) => {
    const bulkId = req.params.bulkId;
    try {
        const bulk = await deleteBulk(bulkId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Discount deleted successfully",
            result: bulk
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete discount",
            error: error
        });
    }
};

// ___________________________________________________________________________________________________________________________________________________________________________________________________

// bulk max orders

export const createBulkAboveMaxOrders = async (req, res) => {
    const bulkData = req.body;
    try {
        const newBulk = await createBulkAbove(bulkData);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Bulk Created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create bulk",
            error: error
        });
    }
};



export const getSingleBulkAboveMaxOrder = async (req, res) => {
    const bulkId = req.params.bulkId;
    try {
        const bulk = await getBulkAboveOrder(bulkId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Bulk fetched successfully",
            result: bulk
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch bulk",
            error: error
        });
    }
};




export const getBulkWithProductId = async (req, res) => {
    const productId = req.params.productId;
    try {
        const bulk = await getBulkByProductId(productId);

        console.log(bulk);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Bulk fetched successfully",
            result: bulk
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch bulk",
            error: error
        });
    }
};


export const submitBulkOrderRequest = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {

        // Check if the user has already submitted a bulk order request
        const requestExists = await isBulkOrderRequestExists(userId);
        if (requestExists) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "User has already submitted a bulk order request wait for admin response",
            });
        }

        await saveBulkOrderRequest(userId, productId, quantity);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Bulk order request submitted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to submit bulk order request",
            error: error.message
        });
    }
};



export const approveBulkAboveMaxOrders = async (req, res) => {
    const bulkId = req.params.bulkId;
    try {
        
        await approveBulkMaxOrder(bulkId);

        // Get user information for the approved bulk order
        const user = await getUserFromBulkOrder(bulkId);
        console.log(user);

        await sendVerificationBulkApproved(user.usr_email, user.usr_firstname, user.prd_name, user.quantity);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Bulk order approved successfully",

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to approve bulk order",
        });
    }
};



export const rejectBulkAboveMaxOrders = async (req, res) => {
    const bulkId = req.params.bulkId;
    try {
        await rejectBulkMaxOrder(bulkId);

        const user = await getUserFromBulkOrder(bulkId);
        console.log(user);
        console.log(user.usr_email, user.usr_firstname, user.prd_name, user.quantity);

        await sendVerificationBulkRejected(user.usr_email, user.usr_firstname, user.prd_name, user.quantity);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Bulk order rejected successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to reject bulk order",
            error: error
        });
    }
};





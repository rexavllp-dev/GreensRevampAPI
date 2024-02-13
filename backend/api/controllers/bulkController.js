import { approveBulkMaxOrder, bulkInsert, createBulkAbove, deleteBulk, existingBulk, existingBulkForUpdate, getABulk, getAllBulk, getBulkAboveOrder, getBulkByProductId, getBulkOrderRequests, getPriceByProductIdAndCalculate, getUserFromBulkOrder, isBulkOrderRequestExists, rejectBulkMaxOrder, saveBulkOrderRequest, updateBulk, updateBulkMaxOrderStatusAndQty } from "../models/bulkModel.js";
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
        };

        const productPrice = await getPriceByProductIdAndCalculate(bulkData.product_id);
        // Format the computed price to two decimal places
        const computedPrice = parseFloat(productPrice.computed_price).toFixed(2);
        console.log("checking_prices", bulkData.discounted_price, computedPrice);

        // Check if discounted price is greater than product price
        if (bulkData.discounted_price >= computedPrice) {

            return res.status(400).json({
                status: 400,
                success: false,
                message: "Discounted price cannot be greater than the product price.",
            });
        };


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

        const existingRange = await existingBulkForUpdate(bulkData, bulkId);

        if (existingRange) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Bulk range already exists.",
            });
        };


        const productPrice = await getPriceByProductIdAndCalculate(bulkData.product_id);
        // Format the computed price to two decimal places
        const computedPrice = parseFloat(productPrice.computed_price).toFixed(2);
        console.log("checking_prices", bulkData.discounted_price, computedPrice);

        // Check if discounted price is greater than product price
        if (bulkData.discounted_price >= computedPrice) {

            return res.status(400).json({
                status: 400,
                success: false,
                message: "Discounted price cannot be greater than the product price.",
            });
        };



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

    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        console.log(userId);

        // Check if the user has already submitted a bulk order request
        const requestExists = await isBulkOrderRequestExists(userId, productId);
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




export const updateAndApproveOrRejectBulkOrders = async (req, res) => {
    try {
        const { bulkId } = req.params;
        const { newStatus, newQuantity } = req.body;

        // Update the bulk order status and quantity
        const updates = await updateBulkMaxOrderStatusAndQty(bulkId, newStatus, newQuantity);

        let messages;

        if (newStatus === 'Accept') {
            // Approve the bulk order
            await approveBulkMaxOrder(bulkId);

            // Get user information for the approved bulk order
            const user = await getUserFromBulkOrder(bulkId);

            // Send verification for bulk approval
            await sendVerificationBulkApproved(user.usr_email, user.usr_firstname, user.prd_name, user.quantity);

            messages = 'Bulk order approved successfully';
        } else if (newStatus === 'Reject') {
            // Reject the bulk order
            await rejectBulkMaxOrder(bulkId);

            // Get user information for the rejected bulk order
            const user = await getUserFromBulkOrder(bulkId);

            // Send verification for bulk rejection
            await sendVerificationBulkRejected(user.usr_email, user.usr_firstname, user.prd_name, user.quantity);

            messages = 'Bulk order rejected successfully';
        } else {
            // If an invalid status is provided
            res.status(400).json({
                status: 400,
                success: false,
                message: "Failed to update bulk order. Invalid status provided"
            });
            return;
        }

        // Respond with success message
        res.status(200).json({
            status: 200,
            success: true,
            message: messages
        });

    } catch (error) {
        console.log(error);
        // If an error occurs, respond with an error message
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
            message: "Failed to update bulk order",
            error: error
        });
    }
};




export const getBulkOrderRequestsHandler = async (req, res) => {
    try {
        // Retrieve bulk order requests from the database
        const bulkRequests = await getBulkOrderRequests();

        res.status(200).json({
            status: 200,
            success: true,
            message: "fetched bulk order requests",
            data: bulkRequests,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch bulk order requests",
            error: error.message
        });
    }
};





export const getPriceByProductId = async (req, res) => {
    try {
        const productId = req.params.productId;

        const price = await getPriceByProductIdAndCalculate(productId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Successful",
            result: price
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed ",
            error: error
        });
    }
}
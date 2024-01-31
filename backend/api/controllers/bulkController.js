import { bulkInsert, createBulkAbove, deleteBulk, getABulk, getAllBulk, getBulkAboveOrder, updateBulk } from "../models/bulkModel.js";


export const createABulk = async (req, res) => {
    const bulkData = req.body;
    try {
        const newBulk = await bulkInsert(bulkData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Discount Created successfully",

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
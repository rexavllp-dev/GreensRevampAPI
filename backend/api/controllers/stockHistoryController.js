import { getAllStockHistory } from "../models/stockHistoryModel.js";

// get all stock history

export const getStockHistory = async (req, res) => {

    try {

        const stockHistory = await getAllStockHistory();
        res.status(200).json({
            status: 200,
            success: true,
            message: "Stock History fetched successfully",
            result: stockHistory
        })

    } catch (error) {

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch stock history",
            error: error
        })
    }
};


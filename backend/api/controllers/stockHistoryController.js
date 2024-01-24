import { getAllStockHistory } from "../models/stockHistoryModel.js";

// get all stock history

export const getStockHistoryByProduct = async (req, res) => {
    const product_id = req.params.product_id;

    try {

        const stockHistory = await getAllStockHistory(product_id);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Stock History fetched successfully",
            result: stockHistory
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch stock history",
            error: error
        })
    }
};


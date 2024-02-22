import { createATransaction } from "../models/transactionModel.js";



export const createTransaction = async (req, res) => {

    const { transactionData } = req.body;

    try {

        const newTransaction = await createATransaction(transactionData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Transaction created successfully",
            result: newTransaction
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create transaction",
            error: error
        });
    }
};
import dbConfig from "../../config/dbConfig.js";
import { CancelIndividualItem, calculateRemainingProductPrice, createCancelOrder, updateIndividualProductQuantity, updateOrderStatus, updateProductQuantities, updateStockHistory } from "../models/cancelOrdersModel.js";

// create cancel order and update order status with order id in  user_orders table
export const createCancelOrders = async (req, res) => {

    const cancelOrderData = req.body;
    const trx = await dbConfig.transaction();

    try {

        // create cancel order
        const newCancelOrder = await createCancelOrder(cancelOrderData, trx);

        // update order status with order id in  user_orders table
        const updatedOrder = await updateOrderStatus(cancelOrderData.order_id, trx);
        //  update product quantity
        const updatedQuantity = await updateProductQuantities(cancelOrderData.order_id, trx);
        // update stock history
        const updatedStockHistory = await updateStockHistory(cancelOrderData.order_id, trx);

        trx.commit();
        res.status(200).json({

            status: 200,
            success: true,
            message: "Order cancelled successfully",
            result: {
                newCancelOrder,
                updatedOrder,
                updatedQuantity,
                updatedStockHistory

            }
        })

    } catch (error) {
        console.log(error);
        trx.rollback();
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to cancel order",

        })
    }

}


// cancel individual order

export const cancelIndividualItems = async (req, res) => {

    
    const cancelOrderData = req.body;
    const trx = await dbConfig.transaction();

    try {

        // create cancel order
        const newCancelOrder = await CancelIndividualItem(cancelOrderData, trx);

        // update order status with order id in  user_orders table

        const updatedOrder = await updateOrderStatus(cancelOrderData.order_id, trx);

        //  update product quantity

        const updatedQuantity = await updateIndividualProductQuantity(cancelOrderData.order_id, trx);

        // update stock history

        const updatedStockHistory = await updateStockHistory(cancelOrderData.order_id, trx);

        // Calculate the remaining product price
        const remainingProductPrice = await calculateRemainingProductPrice(cancelOrderData.order_id, trx);

        // Check if shipping charge should be applied
        let shipping = 0;
        if (remainingProductPrice < 100) {

            shipping = 30;
        }


        trx.commit();

        res.status(200).json({

            status: 200,
            success: true,
            message: "Order cancelled successfully",
            result: {
                newCancelOrder,
                updatedOrder,
                updatedQuantity,
                updatedStockHistory,
                grandTotal: remainingProductPrice + shipping
            }
        })
    } catch (error) {

        console.log(error);
        trx.rollback();

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to cancel order",
        })
    }
}

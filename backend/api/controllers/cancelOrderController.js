import dbConfig from "../../config/dbConfig.js";
import { CancelIndividualItem, createCancelOrder,
     getSingleOrderItem, getOrderItems, getOrderItemsByItemId, updateIndividualOrderStatus, updateIndividualProductQuantity, 
    updateInventoryQtyWhenCancel, updateOrderStatus, updateStockHistoryWhenCancel } from "../models/cancelOrdersModel.js";

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
        // const updatedQuantity = await updateProductQuantities(cancelOrderData.order_id, trx);
        // update stock history

        // get order items
        const orderItems = await getOrderItems(cancelOrderData.order_id, trx);

        orderItems.map(async (item) => {

            const productId = item.product_id;
            const isTrackInventory = item?.inventory_management === true;
            if (isTrackInventory) {
                let newQuantity = parseInt(item.product_quantity) + parseInt(item.op_qty)
                await updateInventoryQtyWhenCancel(trx, productId, { product_quantity: newQuantity });
                const comment = "Order cancelled"
                const action = "add"
                await updateStockHistoryWhenCancel(trx, productId, item.product_quantity, item.op_qty, newQuantity, comment, action)


            }




        })
        // const updatedStockHistory = await updateStockHistory(cancelOrderData.order_id, trx);

        trx.commit();
        res.status(200).json({
            status: 200,
            success: true,
            message: "Order cancelled successfully",
            result: {
                newCancelOrder,
                updatedOrder,

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
        const item = await getSingleOrderItem(cancelOrderData.order_id);

        const item_id = cancelOrderData?.order_id;

        const cancelData = {
            order_id: item?.order_id,
            cancel_reason_id: cancelOrderData.cancel_reason_id,
            cancel_note: cancelOrderData.cancel_note,

        }
        // create cancel order
        const newCancelOrder = await CancelIndividualItem(cancelData, trx, item_id);

        // update order status with order id in  user_orders table

        const updatedOrder = await updateIndividualOrderStatus(cancelOrderData.order_id, trx);

        //  update product quantity

        // const orderItem = await getSingleOrderItem(cancelOrderData.order_id, trx);

        const productId = item?.product_id;

        const isTrackInventory = item?.inventory_management === true;

        if (isTrackInventory) {

            let newQuantity = parseInt(item?.product_quantity) + parseInt(item?.op_qty)
            await updateInventoryQtyWhenCancel(trx, productId, { product_quantity: newQuantity });
            const comment = "Order cancelled"
            const action = "add"
            await updateStockHistoryWhenCancel(trx, productId, item?.product_quantity, item?.op_qty, newQuantity, comment, action)


        }

        // const updatedQuantity = await updateIndividualProductQuantity(cancelOrderData.order_id, trx);

        // update stock history

        // const updatedStockHistory = await updateStockHistory(cancelOrderData.order_id, trx);

        // Calculate the remaining product price
        // const remainingProductPrice = await calculateRemainingProductPrice(cancelOrderData.order_id, trx);

        // // Check if shipping charge should be applied
        // let shipping = 0;
        // if (remainingProductPrice < 100) {

        //     shipping = 30;
        // }


        trx.commit();

        res.status(200).json({

            status: 200,
            success: true,
            message: "Order cancelled successfully",
            result: {
                newCancelOrder,
                updatedOrder,
                // grandTotal: remainingProductPrice + shipping
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


// get all order items
export const getOrderItem = async (req, res) => {

    const orderId = req.params.orderId;

    try {

        const orderItems = await getOrderItemsByItemId(orderId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Order items retrieved successfully",
            result: orderItems
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to retrieve order items",
        })
    }
}
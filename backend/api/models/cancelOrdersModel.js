import db from '../../config/dbConfig.js';


// create cancel order
export const createCancelOrder = async (cancelOrderData, trx) => {
    try {
        const cancelOrder = await trx('cancel_orders').insert({...cancelOrderData, cancel_type:full}).returning('*');
        return cancelOrder;
    } catch (error) {

        trx.rollback();
        throw error;
    }
};


// update order status
export const updateOrderStatus = async (orderId, trx) => {
    console.log(orderId)

    try {

        const updatedOrder = await trx('user_orders')
            .where({ id:orderId })
            .select('ord_order_status')
            .update({ ord_order_status: 6 }) // id of cancel in seeds 
            .returning('*');


            
        // Update op_is_cancel in order_items table
        const updatedOrderItems = await trx('order_items')
            .where({ order_id: orderId })
            .update({ op_is_cancel: true }) // Assuming op_is_cancel is a boolean field
            .returning('*');




        return {updatedOrder, updatedOrderItems};
        

    } catch (error) {

        trx.rollback();
        throw error;
    }
};


// update product quantities
export const updateProductQuantities = async (orderId, trx) => {

    try {
        const productsInOrder = await trx('order_items')
            .where({ order_id: orderId })
            .select('product_id', 'op_qty');
        console.log(productsInOrder)

        const promises = productsInOrder.map(async ({ product_id, op_qty: quantity }) => {
            const currentQuantity = await trx('product_inventory')
                .where('product_id', product_id)
                .select('product_quantity')
                .first();

            console.log(quantity)



            const newQuantity = parseInt(currentQuantity.product_quantity) + parseInt(quantity);

            console.log(newQuantity)
            await trx('product_inventory')
                .where({ product_id: product_id })
                .update({ product_quantity: newQuantity });

            return { productId: product_id, newQuantity };
        });

        const updatedQuantities = await Promise.all(promises);
        return updatedQuantities;
    } catch (error) {
        trx.rollback();
        throw error;
    }
};


// update stock history
export const updateStockHistory = async (stockHistoryData, trx) => {

    try {
        const stockHistory = await trx('stock_history').insert({
            ...stockHistoryData,
            action: 'add',
            comment: 'cancelled'
        }).returning('*');
        return stockHistory;
    } catch (error) {
        trx.rollback();
        throw error;
    }
};



// cancel individual order

export const CancelIndividualItem = async (cancelOrderData, trx) => {
    try {
        const cancelOrder = await trx('cancel_orders').insert({...cancelOrderData, cancel_type:partial}).returning('*');
        return cancelOrder;
    } catch (error) {
        trx.rollback();
        throw error;
    }
};

// update individual product quantity

export const updateIndividualProductQuantity = async (orderId, trx) => {
    
    try {
        // Retrieve the quantity of the specific product in the order
        const orderItem = await trx('order_items')
            .where({ order_id: orderId })
            .select("product_id", 'op_qty')
            .first();


        // Retrieve the current quantity from the product inventory
        const currentQuantity = await trx('product_inventory')
            .where({product_id: orderItem.product_id})
            .select('product_quantity')
            .first();

        // Calculate the new quantity after cancellation
        const newQuantity = currentQuantity.product_quantity + orderItem.op_qty;

        // Update the product inventory with the new quantity
        await trx('product_inventory')
            .where({ product_id: orderItem.product_id })
            .update({ product_quantity: newQuantity });

        return { productId: orderItem.product_id, orderId, newQuantity };
    } catch (error) {
        // Rollback the transaction if an error occurs
        await trx.rollback();
        throw error;
    }
};


// calculate the remaining product price that is not cancelled

export const calculateRemainingProductPrice = async (orderId, trx) => {

    try {
        // Fetch the original order details
        const orderItems = await trx('user_orders').where({ id: orderId }).first();

        // Fetch the canceled product prices
        const canceledOrderItems = await trx('order_items')
            .where({ order_id: orderId })
            .andWhere({ op_is_cancel: true })
            .select('op_price');



        // Calculate the remaining product price

        let remainingProductPrice = orderItems.ord_total;

        if (canceledOrderItems && canceledOrderItems.length > 0) {
            // Subtract the prices of canceled products
            const canceledProductPrices = canceledOrderItems.map(item => item.op_price);
            const cancelProductsTotal = canceledProductPrices.reduce((total, price) => total + price, 0);
            remainingProductPrice = remainingProductPrice - cancelProductsTotal;

            
        }
            // return the remaining product price
            return remainingProductPrice;


    } catch (error) {
        // Rollback the transaction if an error occurs
        await trx.rollback();
        throw error;
    }
    
}







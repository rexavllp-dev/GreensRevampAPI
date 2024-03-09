import db from '../../config/dbConfig.js';


// create cancel order
export const createCancelOrder = async (cancelOrderData, trx) => {
    try {
        const cancelOrder = await trx('cancel_orders').insert({ ...cancelOrderData, cancel_type: "full" }).returning('*');
        return cancelOrder;
    } catch (error) {

        trx.rollback();
        throw error;
    }
};

//update cancel type

export const updateCancelType = async (orderId, trx) => {

    try {

        const updatedOrder = await trx('user_orders')
            .where({ id: orderId })
            .select('cancel_type')
            .update({ cancel_type: full })

        return updatedOrder;
    } catch (error) {

        trx.rollback();
        throw error;
    }
}




export const updateOrderStatus = async (orderId, trx) => {
    console.log(orderId);

    try {
        const updatedOrder = await trx('user_orders')
            .where({ id: orderId })
            .select('ord_order_status')
            .update({ ord_order_status: 6 }) // id of cancel in seeds 
            .returning('*');

        // Update op_is_cancel in order_items table
        const updatedOrderItems = await trx('order_items')
            .where({ order_id: orderId })
            .update({ op_is_cancel: true }) // Assuming op_is_cancel is a boolean field
            .returning('*');

        //  update cancel type in user_orders table based on order status and cancel type

        const cancelType = await trx('user_orders')
            .where({ id: orderId })
            .select('ord_cancel_type')
            .update({ ord_cancel_type: "full" })
            .returning('*');


        return { updatedOrder, updatedOrderItems, cancelType };
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

        const promises = productsInOrder.map(async ({ product_id, op_qty }) => {
            console.log(product_id)
            const currentQuantity = await trx('product_inventory')
                .where('product_id', product_id)
                .select('product_quantity')
                .first();

            console.log(op_qty)
            console.log(currentQuantity)



            const newQuantity = parseInt(currentQuantity?.product_quantity) + parseInt(op_qty);

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

// get all order items

export const getOrderItems = async (orderId, trx) => {

    const orderItems = await trx('order_items')
        .where({ order_id: orderId })
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('product_inventory', 'order_items.product_id', 'product_inventory.product_id')
        .select(
            'order_items.*',
            'products.*',
            'products.id as productId',
            'product_inventory.*',
            'product_inventory.id as inventoryId'
        )

    return orderItems
}





export const updateInventoryQtyWhenCancel = async (trx, productId, data) => {

    try {

        const updatedInventory = await db('product_inventory').where({ product_id: productId })
            .update(data).returning('*')

        // Commit the transaction if everything is successful
    } catch (error) {
        // Rollback the transaction if there's an error
        await trx.rollback();
        throw error; // Rethrow the error for the caller to handle
    }
};


export const updateStockHistoryWhenCancel = async (trx, productId, currentStock, qty, newQuantity, comment, action) => {

    try {
        await db('stock_history').insert({
            product_id: productId,
            previous_stock: currentStock,
            qty: qty,
            remaining_stock: newQuantity,
            comment: comment,
            action: action === 'add' ? 'Stock Returned' : 'Stock cancelled',
            created_at: new Date(),
            updated_at: new Date(),
        });
        // Commit the transaction if everything is successful
    } catch (error) {
        // Rollback the transaction if there's an error
        await trx.rollback();
        throw error; // Rethrow the error for the caller to handle
    }
};



// _________________________________________________________________________________________________________________________________________

// cancel individual order

export const CancelIndividualItem = async (cancelOrderData, trx, itemId) => {


    try {
        const cancelOrderItem = await trx("order_items").where({ id: itemId, order_id: cancelOrderData.order_id }).update({ op_is_cancel: true }).returning('*');
        // const cancelOrder = await trx('reasons').insert({ ...cancelOrderData, cancel_type: "partial" }).returning('*');
        return cancelOrderItem;
    } catch (error) {
        trx.rollback();
        throw error;
    }
};

// update individual order status 
export const updateIndividualOrderStatus = async (orderId, trx,) => {
    console.log(orderId);

    try {

        //  update cancel type in user_orders table based on order status and cancel type

        const cancelType = await trx('user_orders')
            .where({ id: orderId })
            .select('ord_cancel_type')
            .update({ ord_cancel_type: "partial" })
            .returning('*');


        return { cancelType };
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
            .where({ product_id: orderItem.product_id })
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
            .select('op_actual_price');



        // Calculate the remaining product price

        let remainingProductPrice = orderItems.ord_total;

        if (canceledOrderItems && canceledOrderItems.length > 0) {
            // Subtract the prices of canceled products
            const canceledProductPrices = canceledOrderItems.map(item => item.op_actual_price);
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


export const getOrderItemsByItemId = async (orderId) => {

    const orderItems = await db('order_items')

        .where({ 'order_items.id': orderId })
        .leftJoin('products', 'order_items.product_id', 'products.id')
        // .leftJoin('product_inventory', 'order_items.product_id', 'product_inventory.product_id')
        .leftJoin('user_orders', 'order_items.order_id', 'user_orders.id')
        .leftJoin('return_products', 'order_items.id', 'return_products.order_item_id')
        // .leftJoin('product_price', 'order_items.product_id', 'product_price.product_id')
        .leftJoin('replace_products', 'order_items.id', 'replace_products.order_item_id')


        .select(

            'order_items.*',
            'products.*',
            'products.id as productId',
            'user_orders.*',
            'user_orders.id as orderId',
            'return_products.*',
            'return_products.id as returnId',
            'replace_products.*',
            'replace_products.id as replaceId'


        ).first();

    return orderItems;
};






export const getSingleOrderItem = async (itemId) => {

    const orderItems = await db('order_items')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('product_inventory', 'order_items.product_id', 'product_inventory.product_id')
        .select(
            'order_items.*',
            'order_items.id as itemId',
            'products.*',
            'products.id as productId',
            'product_inventory.*',
            'product_inventory.id as inventoryId'
        )
        .where({ 'order_items.id': itemId }).first();

    return orderItems;
};









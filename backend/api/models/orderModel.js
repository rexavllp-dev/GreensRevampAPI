import db from '../../config/dbConfig.js';



// Function to create a user order
export const createUserOrder = async (trx, userId, orderData) => {

    let addressId = null;
    
    if (typeof orderData.address_id === 'number') {
        addressId = orderData.address_id;
    } else if (typeof orderData.address_id === 'string' && !isNaN(parseInt(orderData.address_id))) {
        addressId = parseInt(orderData.address_id);
    }


    try {
        const newOrder = await trx("user_orders")
            .where({ customer_id: userId })
            .insert({
                customer_id: userId,
                address_id: addressId,
                ord_customer_name: orderData.customer_name,
                ord_customer_email: orderData.customer_email,
                ord_customer_country_code: orderData.customer_phone_country_code,
                ord_customer_phone: orderData.customer_phone,
                ord_flat_villa: orderData.flat_villa,
                ord_zip_code: orderData.zip_code,
                ord_payment_method: orderData.payment_method,
                ord_shipping_method: orderData.shipping_method,
            })
            .returning('*');

        return newOrder;
    } catch (error) {
        await trx.rollback();
        throw error;
    }
};



// Function to create order items
export const createOrderItems = async (trx, orderId, orderItems) => {

    try {

        const insertedOrderItems = [];

        for (const item of orderItems) {
            item.order_id = orderId;
            const insertedItem = await trx('order_items')
                .insert(item)
                .returning('*');
            insertedOrderItems.push(insertedItem);
        }

        return insertedOrderItems;

        // Commit the transaction if everything is successful
    } catch (error) {
        // Rollback the transaction if there's an error
        await trx.rollback();
        throw error; // Rethrow the error for the caller to handle
    }
};

// Update product inventory
export const updateInventoryQty = async (trx, productId, data) => {

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

// Update stock history table
export const updateStockHistoryWhenOrder = async (trx, productId, currentStock, qty, newQuantity, comment, action) => {

    try {
        await db('stock_history').insert({
            product_id: productId,
            previous_stock: currentStock,
            qty: qty,
            remaining_stock: newQuantity,
            comment: comment,
            action: action === 'add' ? 'Stock Returned' : 'Stock Sold',
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



// Function to insert a new address into the database
export const insertNewAddressIntoDatabase = async (
    trx,
    customerId,
    addressLine,
    addressLine2,
    flatVilla,
    customerName,
    customerEmail,
    customerCountryCode,
    customerPhone,
    contactlessDelivery,
    deliveryRemark,
    zipCode,
    addressTitle
) => {
    try {

        const [insertedAddressId] = await trx("address")
            .insert({
                user_id: customerId,
                full_name: customerName,
                usr_email: customerEmail,
                mobile_country_code: customerCountryCode,
                mobile_number: customerPhone,
                address_line_1: addressLine,
                address_line_2: addressLine2,
                flat_villa: flatVilla,
                contactless_delivery: contactlessDelivery,
                delivery_remark: deliveryRemark,
                zip_code: zipCode,
                address_title: addressTitle
            })

            .returning('id');

        return insertedAddressId;

    } catch (error) {

        await trx.rollback();

        throw error;
    }
};





export const updateAnOrder = async (orderId, updatedData) => {
    const updatedOrder = await db("user_orders")
        .where({ id: orderId })
        .update(updatedData)
        .returning('*');
    return updatedOrder;
};


export const getAOrder = async (orderId) => {
    const order = await db("user_orders")
        .where({ 'user_orders.id': orderId })
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('address', 'user_orders.address_id', 'address.id')

        .select(

            'user_orders.*',
            'user_orders.id as orderId',
            'order_items.*',
            'order_items.id as orderItemId',
            'products.*',
            'products.id as productId',
            'address.*',
            'address.id as addressId'
        );

    return order;
};




export const getAllUserOrders = async (order_status_id, search_query, order_date) => {
    let orders = await db("user_orders")
        .select(
            'user_orders.*',
            'user_orders.id as orderId'
        );

    if (order_status_id !== null) {
        orders.where({ 'user_orders.ord_order_status': order_status_id });
    };

    if (search_query !== null) {
        orders.where(function () {
            this.where('user_orders.ord_customer_name', 'ilike', `%${search_query}%`)
                .orWhere('user_orders.ord_customer_phone', 'ilike', `%${search_query}%`)
                .orWhere('user_orders.ord_customer_email', 'ilike', `%${search_query}%`);
        });
    };

    if (order_date !== null) {
        orders.where({ 'user_orders.created_at': order_date });
    };

    for (let order of orders) {
        let products = await db("order_items")
            .leftJoin('products', 'order_items.product_id', 'products.id')
            .select(
                'order_items.*',
                'order_items.id as orderItemId',
                'products.*',
                'products.id as productId',
            )
            .where('order_items.order_id', order.id);

        order.products = products;
    }

    return orders;
};






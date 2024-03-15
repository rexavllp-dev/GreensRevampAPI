import db from '../../config/dbConfig.js';
import { createStockHistory } from './stockHistoryModel.js';




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
                ord_accepted_by: 5, // hardcoded value for default warehouse user
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

            const getProduct = await trx('products').select('*').where({ id: insertedItem[0].product_id }).first();
            console.log("products", getProduct);
            insertedItem.push(getProduct);
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
                address_email: customerEmail,
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
    const orders = await db("user_orders")
        .where({ 'user_orders.id': orderId })
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('address', 'user_orders.address_id', 'address.id')
        .leftJoin('return_products', 'return_products.order_item_id', 'order_items.id')
        .leftJoin('replace_products', 'replace_products.order_item_id', 'order_items.id')
        .leftJoin('order_statuses', 'order_statuses.id', 'user_orders.ord_order_status')

        .select(
            'user_orders.*',
            'user_orders.id as orderId',
            'user_orders.created_at as orderDate',
            'order_items.*',
            'order_items.id as orderItemId',
            'products.*',
            'products.id as productId',
            'address.*',
            'address.id as addressId',
            'return_products.*',
            'return_products.id as returnProductId',
            'replace_products.*',
            'replace_products.id as replaceProductId',
            'order_statuses.status_name',
        );

    const groupedOrders = [];

    orders.forEach((order) => {
        const existingOrder = groupedOrders.find((o) => o.orderId === order.orderId);

        if (existingOrder) {
            // Check if the order item with the same ID already exists in the orderItems array
            const existingOrderItem = existingOrder.orderItems.find((item) => item.id === order.orderItemId);

            if (!existingOrderItem) {
                // If the order item doesn't exist, push it to the orderItems array
                existingOrder.orderItems.push({
                    id: order.orderItemId,
                    order_id: order.orderId,
                    product_id: order.productId,
                    product_name: order.prd_name,
                    order_actual_price: order.op_actual_price,
                    order_op_unit_price: order.op_unit_price,
                    order_op_line_total: order.op_line_total,
                    order_op_qty: order.op_qty,
                    op_is_cancel: order.op_is_cancel,
                    op_is_return: order.op_is_return,
                });
            }
        } else {
            // If the order doesn't exist in the accumulator, create a new order object
            groupedOrders.push({
                ...order,
                orderItems: [
                    {
                        id: order.orderItemId,
                        order_id: order.orderId,
                        product_id: order.productId,
                        product_name: order.prd_name,
                        order_actual_price: order.op_actual_price,
                        order_op_unit_price: order.op_unit_price,
                        order_op_line_total: order.op_line_total,
                        order_op_qty: order.op_qty,
                        op_is_cancel: order.op_is_cancel,
                        op_is_return: order.op_is_return,
                    },
                ],
            });
        }
    });

    return groupedOrders;
};





export const getAOrderData = async (orderId) => {
    const orders = await db("user_orders")
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .where({ 'user_orders.id': orderId })
        .select(

            'user_orders.*',
            'user_orders.id as orderId',
            'order_items.*',
            'order_items.id as orderItemId',
            'order_items.product_id as orderProductId',
            'products.*',
            'products.id as productId',


        )
        .groupBy('user_orders.id', 'order_items.id', 'products.id');


    // Group orders by orderId
    const groupedOrders = {};
    orders.forEach(order => {
        if (!groupedOrders[order.orderId]) {
            groupedOrders[order.orderId] = {
                ...order,
                products: [],
                productTotalQty: 0,
            };
        }
        if (order.productId) {
            const opQty = parseInt(order.op_qty, 10) || 0;
            groupedOrders[order.orderId].products.push({
                ...order,
            });

            // Summing up the op_qty for each product
            groupedOrders[order.orderId].productTotalQty += opQty;
        }
    });

    // Convert the object back to an array of orders
    const resultOrders = Object.values(groupedOrders);

    return resultOrders;
};





export const getAllUserOrders = async (order_status_id, search_query, order_date, driverId, page, perPage, paymentMethod, acceptedBy, sortBy) => {
    let query = db("user_orders")
        .leftJoin('users', 'user_orders.customer_id ', 'users.id')
        .leftJoin('users as deliveryboy', 'user_orders.ord_delivery_accepted_by', 'deliveryboy.id')
        .leftJoin('users as warehouse', 'user_orders.ord_accepted_by', 'warehouse.id')
        .leftJoin('order_statuses', 'user_orders.ord_order_status', 'order_statuses.id')
        .select(
            'users.*',
            'users.id as userId',
            'deliveryboy.usr_firstname as delivery_boy_firstname',
            'deliveryboy.usr_lastname as delivery_boy_lastname',
            'warehouse.usr_firstname as warehouse_firstname',
            'warehouse.usr_lastname as warehouse_lastname',
            'user_orders.*',
            'user_orders.id as orderId',
            'order_statuses.status_name'
        )
        .offset((page - 1) * perPage)
        .limit(perPage);

    // const offset = (page - 1) * perPage;
    // orders.offset(offset).limit(perPage);

    if (order_status_id !== null) {
        query.where({ 'user_orders.ord_order_status': order_status_id });
    };

    if (paymentMethod !== null) {
        query.where({ 'user_orders.ord_payment_method': paymentMethod });
    };

    // search divers by name
    if (driverId !== null) {
        query.where({ 'user_orders.ord_delivery_accepted_by': driverId });
    };
    // search by warehouse accepted by
    if (acceptedBy !== null) {
        query.where({ 'user_orders.ord_accepted_by': acceptedBy });
    };


    if (search_query !== null) {
        query.where(function () {
            this.where('user_orders.ord_customer_name', 'ilike', `%${search_query}%`)
                .orWhere('user_orders.ord_customer_phone', 'ilike', `%${search_query}%`)
                .orWhere('user_orders.ord_customer_email', 'ilike', `%${search_query}%`);
        });
    };

    if (order_date !== null) {
        query.where({ 'user_orders.created_at': order_date });
    };

    if (sortBy !== null) {
        if (sortBy === 'newest') {
            sortBy = 'asc'
        } else if (sortBy === 'oldest') {
            sortBy = 'desc'
        }
        query.orderBy('user_orders.created_at', sortBy);
    }

    let orders = await query;

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



// get all order of a user
export const getDashboardOrders = async (userId, role) => {


    const orders = await db("user_orders")
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('address', 'user_orders.address_id', 'address.id')
        .leftJoin({ accepted: 'users' }, 'user_orders.ord_accepted_by', 'accepted.id') // Corrected alias reference
        .leftJoin({ delivery: 'users' }, 'user_orders.ord_delivery_accepted_by', 'delivery.id') // Corrected alias reference
        .select(

            'user_orders.*',
            'user_orders.id as orderId',
            'order_items.*',
            'order_items.id as orderItemId',
            'order_items.product_id as orderProductId',
            'products.*',
            'products.id as productId',
            'address.*',
            'address.id as addressId',
            db.raw('MAX(accepted.usr_firstname) as acceptedusername'),
            db.raw('MAX(delivery.usr_firstname) as deliveryusername'),
            db.raw('DATE(user_orders.created_at) AS order_date')

        )
        .where(builder => {
            //Role 3 = Warehouse
            //Role 4 = Picker
            //Role 5 = QC
            if (role == 3) {
                builder.where('user_orders.ord_accepted_by', userId).whereNull('user_orders.ord_picker_accepted_by');
            }
            if (role == 4) {
                builder.where('user_orders.ord_picker_accepted_by', userId).where('user_orders.picker_verified', false);
            }

            if (role == 5) {
                builder.whereNull('user_orders.ord_qc_confirmed').whereNotNull('user_orders.picker_verified');
            }
        })

        .groupBy('user_orders.id', 'order_items.id', 'products.id', 'address.id');



    var orderLoop = await orders;


    // Group orders by orderId
    const groupedOrders = {};
    orderLoop.forEach(order => {
        if (!groupedOrders[order.orderId]) {

            groupedOrders[order.orderId] = {
                ...order,
                products: [],
                productTotalQty: 0,
            };
        }
        if (order.productId) {
            const opQty = parseInt(order.op_qty, 10) || 0;
            groupedOrders[order.orderId].products.push({
                ...order,
            });

            // Summing up the op_qty for each product
            groupedOrders[order.orderId].productTotalQty += opQty;
        }
    });

    // Convert the object back to an array of orders
    const resultOrders = Object.values(groupedOrders);
    resultOrders.forEach(order => {

        order.order_date = new Date(order.order_date).toISOString().slice(0, 10);
        var dateParts = order.order_date.split('-');
        var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
        order.order_date = formattedDate;


        var originalDate = new Date(order.order_date);
        var hours = originalDate.getHours();
        var minutes = originalDate.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)

        var formattedTime = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ' ' +
            ampm;

        order.order_time = formattedTime;

    });

    return resultOrders;
};


// get all assigned order of a user
export const getAssinedOrders = async (userId, role) => {

    const orders = await db("user_orders")
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('address', 'user_orders.address_id', 'address.id')
        .leftJoin({ accepted: 'users' }, 'user_orders.ord_accepted_by', 'accepted.id')
        .leftJoin({ delivery: 'users' }, 'user_orders.ord_delivery_accepted_by', 'delivery.id')
        .select(

            'user_orders.*',
            'user_orders.id as orderId',
            'order_items.*',
            'order_items.id as orderItemId',
            'order_items.product_id as orderProductId',
            'products.*',
            'products.id as productId',
            'address.*',
            'address.id as addressId',
            db.raw('MAX(accepted.usr_firstname) as acceptedusername'),
            db.raw('MAX(delivery.usr_firstname) as deliveryusername'),
            db.raw('DATE(user_orders.created_at) AS order_date')
        )
        .where(builder => {
            //Role 3 = Warehouse
            //Role 4 = Picker
            //Role 5 = QC
            if (role == 3) {
                builder.where('user_orders.ord_accepted_by', userId).whereNotNull('user_orders.ord_picker_accepted_by');
            }
            if (role == 4) {
                builder.where('user_orders.ord_picker_accepted_by', userId).where('user_orders.picker_verified', true);
            }

            if (role == 5) {
                builder.where('user_orders.ord_qc_confirmed', userId).whereNotNull('user_orders.ord_delivery_accepted_by');
            }
        })

        .groupBy('user_orders.id', 'order_items.id', 'products.id', 'address.id');



    var orderLoop = await orders;


    // Group orders by orderId
    const groupedOrders = {};
    orderLoop.forEach(order => {
        if (!groupedOrders[order.orderId]) {

            groupedOrders[order.orderId] = {
                ...order,
                products: [],
                productTotalQty: 0,
            };
        }
        if (order.productId) {
            const opQty = parseInt(order.op_qty, 10) || 0;
            groupedOrders[order.orderId].products.push({
                ...order,
            });

            // Summing up the op_qty for each product
            groupedOrders[order.orderId].productTotalQty += opQty;
        }
    });

    // Convert the object back to an array of orders
    const resultOrders = Object.values(groupedOrders);
    resultOrders.forEach(order => {

        order.order_date = new Date(order.order_date).toISOString().slice(0, 10);
        var dateParts = order.order_date.split('-');
        var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
        order.order_date = formattedDate;


        var originalDate = new Date(order.order_date);
        var hours = originalDate.getHours();
        var minutes = originalDate.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)

        var formattedTime = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ' ' +
            ampm;

        order.order_time = formattedTime;

    });

    return resultOrders;
};



export const assignPicker = async (orderId, pickerId) => {

    try {

        const updatePicker = await db('user_orders').where({ id: orderId })
            .update({ 'ord_picker_accepted_by': pickerId, picker_verified: false }).returning('*')
        return updatePicker;


        // Commit the transaction if everything is successful
    } catch (error) {
        // Rollback the transaction if there's an error
        throw error; // Rethrow the error for the caller to handle
    }

};



export const verifyItem = async (orderId) => {

    try {

        //Updating Order status
        await db('user_orders').where({ id: orderId })
            .update({ 'ord_order_status': 2 }).returning('*')

        //Updating Picker Verification
        const verifyItem = await db('user_orders').where({ id: orderId })
            .update({ 'picker_verified': true }).returning('*')
        return verifyItem;



        // Commit the transaction if everything is successful
    } catch (error) {
        // Rollback the transaction if there's an error
        throw error; // Rethrow the error for the caller to handle
    }

};

export const assignDriver = async (userId, orderId, driverId, boxes) => {

    try {


        //Updating Order status
        await db('user_orders').where({ id: orderId })
            .update({ 'ord_order_status': 3 }).returning('*')

        // Assigning Driver to the Order
        const updatePicker = await db('user_orders').where({ id: orderId })
            .update({ 'ord_delivery_accepted_by': driverId, 'ord_qc_confirmed': userId, 'no_boxes': boxes }).returning('*')
        return updatePicker;

        // Commit the transaction if everything is successful
    } catch (error) {
        // Rollback the transaction if there's an error
        throw error; // Rethrow the error for the caller to handle
    }

};



export const ordersByDriver = async (driverId) => {

    try {

        const driverOrders = await db('user_orders').leftJoin('address', 'user_orders.address_id', 'address.id').select('user_orders.*',
            'user_orders.id as orderId',
            'address.*').where('ord_delivery_accepted_by', driverId).where('ord_order_status', '!=', 5);
        return driverOrders;

        // Commit the transaction if everything is successful
    } catch (error) {
        // Rollback the transaction if there's an error
        throw error; // Rethrow the error for the caller to handle
    }

};



// cancel order by admin

export const cancelOrderbyAdmin = async (cancelOrderData) => {

    try {
        const cancelOrder = await db('cancel_orders').insert({ ...cancelOrderData, cancel_type: "full" }).returning('*');
        return cancelOrder;


    } catch (error) {

    }
};






//     const cancelOrder = await db('user_orders').where({ id: orderId })
//         .update({ 'ord_order_status': 6 }).returning('*')



//     return cancelOrder;


// }
// Add remarks to the order by admin
export const addARemarks = async (orderId, remark) => {

    const remarks = await db('user_orders')
        .where({ id: orderId })
        .update({
            ord_remarks: remark
        })
        .returning('*');

    return remarks;
};

// update order items qty and update product inventory
export const updateItemQty = async (orderItemId, opQty, orderId) => {

    // Retrieve the current op_qty and product_id from the order_items table
    const currentOrderItem = await db('order_items')
        .select('op_qty', 'product_id')
        .where({ id: orderItemId })
        .first();


    // Calculate the difference between the new op_qty and the previous op_qty
    const qtyDifference = opQty - currentOrderItem.op_qty;


    // Update the op_qty in the order_items table
    const updatedOrderItem = await db('order_items')
        .where({ id: orderItemId })
        .update({ op_qty: opQty })
        .returning('*');


    // Retrieve the product_quantity before updating
    const productInventory = await db('product_inventory')
        .select('product_quantity')
        .where({ product_id: currentOrderItem.product_id })
        .first();


    // Update the product_quantity in the product_inventory table
    await db('product_inventory')
        .where({ product_id: currentOrderItem.product_id })
        .increment('product_quantity', -qtyDifference);

    const productNewQty = await db('product_inventory')
        .select('product_quantity')
        .where({ product_id: currentOrderItem.product_id })
        .first();

    const updatedNewQty = parseInt(productNewQty.product_quantity);




    // Create stock history record
    await createStockHistory({

        product_id: currentOrderItem.product_id,
        previous_stock: productInventory.product_quantity,
        qty: Math.abs(qtyDifference),
        remaining_stock: updatedNewQty,
        order_id: orderId,
        action: qtyDifference > 0 ? 'reduced' : 'added',
        comment: 'Updated Order Quantity',
        created_at: new Date(),
        updated_at: new Date(),

    });

    return updatedOrderItem;

};


export const getOrderIdByOrderItems = async (orderItemId) => {
    const result = await db('order_items')
        .select('order_id')
        .where({ id: orderItemId })
        .first();

    return result ? result.order_id : null;
};


import db from '../../config/dbConfig.js';



// Function to create a user order
export const createUserOrder = async (userId, orderData) => {
    let addressId = null;
    if (typeof orderData.address_id === 'number') {
        addressId = orderData.address_id;
    } else if (typeof orderData.address_id === 'string' && !isNaN(parseInt(orderData.address_id))) {
        addressId = parseInt(orderData.address_id);
    }

    console.log(orderData);
    const trx = await db.transaction(); // Start a transaction

    try {
        const newOrder = await trx("user_orders")
            .where({ customer_id: userId })
            .insert({
                customer_id: userId,
                address_id: addressId,
                ord_customer_name: orderData.customer_name,
                ord_customer_email: orderData.customer_email,
                ord_customer_phone: orderData.customer_phone,
                ord_flat_villa: orderData.flat_villa,
                // ord_zip_code: orderData.zip_code,
                ord_payment_method: orderData.payment_method,
                ord_shipping_method: orderData.shipping_method,
            })
            .returning('id');

        // Commit the transaction if everything is successful
        await trx.commit();

        return newOrder;
    } catch (error) {
        // Rollback the transaction if there's an error
        await trx.rollback();
        throw error; // Rethrow the error for the caller to handle
    }
};

// Function to create order items
export const createOrderItems = async (orderId, orderItems) => {
    const trx = await db.transaction(); // Start a transaction

    try {
        for (const item of orderItems) {
            item.order_id = orderId;
            await db('order_items').transacting(trx).insert(item);
        }

        // Commit the transaction if everything is successful
        await trx.commit();
    } catch (error) {
        // Rollback the transaction if there's an error
        await trx.rollback();
        throw error; // Rethrow the error for the caller to handle
    }
};






// export const createAOrder = async (userId, orderData, orderItems) => {
//     const trx = await db.transaction(); // Start a transaction

//     try {
//         const newOrder = await trx("user_orders")
//             .where({ user_id: userId })
//             .insert(orderData)
//             .returning('id');


//         for (const item of orderItems) {
//             item.order_id = newOrder[0].id;
//             await db('order_items').transacting(trx).insert(item);
//         }


//         // Commit the transaction if everything is successful
//         await trx.commit();

//         return newOrder;
//     } catch (error) {
//         // Rollback the transaction if there's an error
//         await trx.rollback();
//         throw error; // Rethrow the error for the caller to handle
//     } 

// };



// model.js

// Function to insert a new address into the database
export const insertNewAddressIntoDatabase = async (customerId, addressLine, flatVilla, customerName, customerPhone) => {
    const trx = await db.transaction(); // Start a transaction

        console.log(addressLine);
    try {
        // Insert the new address into the database
        const [insertedAddressId] = await trx("address")
            .insert({

                user_id: customerId,
                full_name: customerName,
                mobile_number: customerPhone,
                address_line_1: addressLine,
                flat_villa: flatVilla,

                
            })
            .returning('id');

        // Commit the transaction if everything is successful
        await trx.commit();

        return insertedAddressId;
    } catch (error) {
        // Rollback the transaction if there's an error
        await trx.rollback();
        throw error; // Rethrow the error for the caller to handle
    }
};



export const updateAnOrder = async (orderId, updatedData) => {
    const updatedOrder = await db("orders")
        .where({ id: orderId })
        .update(updatedData)
        .returning('*');
    return updatedOrder;
};


export const getAOrder = async (orderId) => {
    const order = await db("orders")
        .where({ id: orderId })
        .select('*')

    return order;
};


export const getOrders = async () => {
    const orders = await db("orders")
        .select('*');
    return orders;
};





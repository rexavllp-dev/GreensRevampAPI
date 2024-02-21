import db from '../../config/dbConfig.js';



export const createAOrder = async (userId, orderData) => {
    const newOrder = await db("orders")
        .where({ user_id: userId })
        .insert({
            user_id: userId,
            ...orderData
        })
        .returning('*');
    return newOrder;
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
}


export const getOrders = async () => {
    const orders = await db("orders")
        .select('*');
    return orders;
};





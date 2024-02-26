import db from '../../config/dbConfig.js';


// get all order of a user
export const getAllUserOrders = async (userId) => {

    const orders = await db("user_orders")
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .where({ 'user_orders.customer_id': userId })
        .select(

            'user_orders.*',
            'user_orders.id as orderId',
            'order_items.*',
            'order_items.id as orderItemId',
            'order_items.product_id as orderProductId',
            'products.*',
            'products.id as productId',
        );

    // Group orders by orderId
    const groupedOrders = {};
    orders.forEach(order => {
        if (!groupedOrders[order.orderId]) {
            groupedOrders[order.orderId] = {
                ...order,
                products: [],
            };
        }
        if (order.productId) {
            groupedOrders[order.orderId].products.push({
                ...order,
                // Remove unnecessary order-level properties from product objects
                orderId: undefined,
                orderItemId: undefined,
                productId: undefined,
            });
        }
    });

    // Convert the object back to an array of orders
    const resultOrders = Object.values(groupedOrders);

    return resultOrders;
};


// user order details 

export const getUserOrderDetails = async (orderId) => {

    const order = await db("user_orders")
        .where({ 'user_orders.id': orderId })
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')

        .select(

            'user_orders.*',
            'user_orders.id as orderId',
            'order_items.*',
            'order_items.id as orderItemId',
            'products.*',
            'products.id as productId',

        )

    return order;

};


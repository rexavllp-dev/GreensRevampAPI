import db from '../../config/dbConfig.js';


// get all order of a user
export const getAllUserOrders = async (userId, sort) => {
    console.log(sort);
    let ordersQuery = db("user_orders")
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('address', 'user_orders.address_id', 'address.id')
        .where({ 'user_orders.customer_id': userId })
        .select(
            'user_orders.*',
            'user_orders.id as orderId',
            'order_items.*',
            'order_items.id as orderItemId',
            'order_items.product_id as orderProductId',
            'products.*',
            'products.id as productId',
            'address.*',
            'address.id as addressId'
        )
        .groupBy('user_orders.id', 'order_items.id', 'products.id', 'address.id');

    // Apply sorting
    // if (sort == 'newest') {
        // ordersQuery = ordersQuery.orderBy('user_orders.created_at', 'asc');
    // } else if (sort == 'oldest') {
    //     ordersQuery = ordersQuery.orderBy('user_orders.created_at', 'asc');
    // }

    // Execute the query
    const orders = await ordersQuery;

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

export const getUserDashboardOrders = async (userId, userRole) => {

    const orders = await db("user_orders")
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('address', 'user_orders.address_id', 'address.id')



        .where({ 'user_orders.customer_id': userId })
        .select(

            'user_orders.*',
            'user_orders.id as orderId',
            'order_items.*',
            'order_items.id as orderItemId',
            'order_items.product_id as orderProductId',
            'products.*',
            'products.id as productId',
            'address.*',
            'address.id as addressId'


        )
        .groupBy('user_orders.id', 'order_items.id', 'products.id', 'address.id')

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


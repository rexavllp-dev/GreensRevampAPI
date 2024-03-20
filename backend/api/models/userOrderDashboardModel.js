import db from '../../config/dbConfig.js';


// get all order of a user
export const getAllUserOrders = async (userId, sort, statusFilter) => {
    console.log(sort);
    let ordersQuery = db("user_orders")
        .leftJoin('order_items', 'order_items.order_id', 'user_orders.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('address', 'user_orders.address_id', 'address.id')
        // .leftJoin('order_statuses', 'user_orders.ord_order_status', 'order_statuses.id')

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
            'address.id as addressId',

            'order_statuses.*',
            'order_statuses.id as orderStatusId',

        )
        .groupBy(

            'user_orders.id',
            'order_items.id',
            'products.id',
            'address.id',
            // 'order_statuses.id',
        );


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
    let resultOrders = Object.values(groupedOrders);


    // Filter orders by status if provided
    if (statusFilter) {
        resultOrders = resultOrders.filter(order => order.ord_order_status === statusFilter);
    }



    // Sorting
    if (sort === 'newest') {
        resultOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sort === 'oldest') {
        resultOrders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }




    console.log(resultOrders);

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


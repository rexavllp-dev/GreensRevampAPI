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
            'products.*',
            'products.id as productId',

        );

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

        
}


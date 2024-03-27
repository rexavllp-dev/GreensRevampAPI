import db from '../../config/dbConfig.js';



export const getsAllCustomerOrderCount = async () => {
    const query = await db('user_orders')
        .select('customer_id')
        .count('id as total_orders')
        .groupBy('customer_id');
    
    return query;
};



export const getsAllCustomerOrderReports = async () => {
    const query = await db('user_orders')
    
        .select(

            'user_orders.customer_id',
            'user_orders.id as userOrderId',
            'user_orders.ord_customer_name',
            'user_orders.ord_customer_email',
            

            )
      
    
    return query;
};

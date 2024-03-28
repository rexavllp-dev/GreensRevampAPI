import db from '../../config/dbConfig.js';



export const getsAllCustomerOrderCount = async () => {
    const query = await db('user_orders')
        .select('customer_id')
        .count('id as total_orders')
        .groupBy('customer_id');

    return query;
};



export const getProductCountByUser = async () => {

    const query = await db('user_orders')

        .leftJoin('order_items', 'user_orders.id', 'order_items.order_id')
        .select('user_orders.customer_id')
        .count('order_items.id as total_products')
        .groupBy('user_orders.customer_id');

    return query;

};




export const getsAllCustomerOrderReports = async () => {
    const query = await db('user_orders')

        .select(

            'user_orders.customer_id',
            'user_orders.id as userOrderId',
            'user_orders.ord_customer_name',
            'user_orders.ord_customer_email',
            'user_orders.created_at as orderDate',
            "user_orders.ord_sub_total as orderSubTotal",
            "user_orders.ord_grand_total as orderGrandTotal",


        )


    return query;
};



export const getsAllProductStockReports = async () => {

    const query = await db('product_inventory')

        .leftJoin('products', 'product_inventory.product_id', 'products.id')

        .select(


            'product_inventory.id as productInventoryId',
            'product_inventory.sku',
            'product_inventory.product_quantity',
            'product_inventory.stock_availability',


            'products.id as productId',
            'products.prd_name',
        )

    return query;

};





export const getsAllReturnReports = async () => {


    const query = await db('return_products')

        .leftJoin('users', 'users.id', 'return_products.user_id')
        .leftJoin('order_items', 'return_products.order_item_id', 'order_items.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('product_inventory', 'order_items.product_id', 'product_inventory.product_id')


        .select(

            'users.id as userId',
            'users.usr_firstname',
            'users.usr_lastname',
            'users.usr_email',

            'return_products.id as returnId',
            'return_products.return_status',
            'return_products.created_at as returnDate',

            'order_items.id as orderItemId',
            'order_items.op_qty',

            'products.id as productId',
            'products.prd_name',

            'product_inventory.id as productInventoryId',
            'product_inventory.sku',

        )


    return query;
};




export const getsAllReplaceReports = async () => {


    const query = await db('replace_products')

        .leftJoin('users', 'users.id', 'replace_products.user_id')
        .leftJoin('order_items', 'replace_products.order_item_id', 'order_items.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('product_inventory', 'order_items.product_id', 'product_inventory.product_id')


        .select(

            'users.id as userId',
            'users.usr_firstname',
            'users.usr_lastname',
            'users.usr_email',

            'replace_products.id as replaceId',
            'replace_products.replace_status',
            'replace_products.created_at as replaceDate',
            'replace_products.replace_qty',

            'order_items.id as orderItemId',
            'order_items.op_qty',

            'products.id as productId',
            'products.prd_name',

            'product_inventory.id as productInventoryId',
            'product_inventory.sku',

        )


    return query;
};



export const getsAllCancelledOrderReports = async () => {

    const query = await db('cancel_orders')

        .leftJoin('user_orders', 'cancel_orders.order_id', 'user_orders.id')
        .leftJoin('reasons', 'cancel_orders.cancel_reason_id', 'reasons.id')



        .select(

            'cancel_orders.id as cancelId',
            'cancel_orders.order_id',
            'cancel_orders.created_at as cancelDate',

            'reasons.id as reasonId',
            'reasons.clr_reason',


            'user_orders.id as userOrderId',
            'user_orders.ord_customer_name',

        )


    return query;
};



export const getsAllSearchReports = async () => {

    const query = await db('search_history')

        .select('*')

    return query;

};


export const getAllSearchKeywordCount = async () => {

    const query = await db('search_history')
        .select('search_keyword')
        .count('* as count')
        .groupBy('search_keyword');

    return query;
};




export const getsAllBrandsReports = async () => {

    const query = await db('brands')

        .leftJoin('products', 'brands.id', 'products.prd_brand_id')
        .leftJoin('products_price', 'products.id', 'products_price.product_id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .leftJoin('product_category', 'products.id', 'product_category.product_id')
        .leftJoin('categories', 'categories.id', 'product_category.category_id')

        .select(

            'brands.id as brandId',
            'brands.brd_name',

            "products.id as productId",
            "products.prd_name",
            "products.prd_expiry_date",

            "products_price.id as productPriceId",
            "products_price.product_price",


            "product_inventory.id as productInventoryId",
            "product_inventory.sku",
            "product_inventory.product_quantity",

            "product_category.id as productCategoryId",

            "categories.id as categoryId",
            "categories.cat_name",


        );

    return query;
};



export const getsAllCouponReports = async () => {

    const query = await db('coupons')
        .select('*');

    return query;
};



export const getsAllDeadStockReports = async () => {

    const query = await db('product_inventory')
        .select('*')
        .where('product_quantity', '<', 10);


    return query;
}
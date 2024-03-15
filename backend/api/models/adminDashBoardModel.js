import db from "../../config/dbConfig.js";


export const getsAllRecentOrders = async () => {

    const orders = await db("user_orders")
        .leftJoin("order_statuses", "user_orders.ord_order_status", "order_statuses.id")

        .select(

            "user_orders.id as orderId",
            "user_orders.ord_order_status as orderStatus",
            "user_orders.ord_customer_name",
            "user_orders.ord_customer_phone",
            "user_orders.ord_customer_email",
            "user_orders.ord_sub_total as orderSubTotal",
            "user_orders.created_at as orderCreatedDate",

            "order_statuses.id as orderStatusId",
            "order_statuses.status_name as orderStatusName"

        )

        .orderBy("user_orders.created_at", "desc");


    return orders;
};


export const getsLatestCancelledOrders = async () => {

    const canceledOrders = await db("cancel_orders")

        .leftJoin("user_orders", "cancel_orders.order_id", "user_orders.id")
        .leftJoin("reasons", "cancel_orders.cancel_reason_id", "reasons.id")

        .select()

    return canceledOrders;

};



export const getsLatestReturnedOrders = async () => {

    const returnedOrders = await db("return_products")

        .leftJoin("order_items", "return_products.order_item_id", "order_items.id")
        .leftJoin("user_orders", "order_items.order_id", "user_orders.id")
        .leftJoin("reasons", "return_products.reason_id", "reasons.id")

        .select(


            "return_products.id as returnId",
            "return_products.reason_id as returnReasonId",
            "return_products.created_at as returnDate",


            "reasons.id as reasonId",
            "reasons.clr_reason as returnReason",


            "order_items.id as orderItemId",


            "user_orders.id as orderId",
            "user_orders.ord_customer_name",
            "user_orders.ord_customer_phone",
            "user_orders.ord_customer_email",
            "user_orders.ord_sub_total as orderSubTotal",


        )

    return returnedOrders;

};





export const getsAllLatestReplacementOrders = async () => {

    const replacementOrders = await db("replace_products")

        .leftJoin("order_items", "replace_products.order_item_id", "order_items.id")
        .leftJoin("user_orders", "order_items.order_id", "user_orders.id")
        .leftJoin("reasons", "replace_products.reason_id", "reasons.id")

        .select(


            "replace_products.id as replacementId",
            "replace_products.reason_id as replacementReasonId",
            "replace_products.created_at as replacementDate",


            "reasons.id as reasonId",
            "reasons.clr_reason as replacementReason",


            "order_items.id as orderItemId",


            "user_orders.id as orderId",
            "user_orders.ord_customer_name",
            "user_orders.ord_customer_phone",
            "user_orders.ord_customer_email",
            "user_orders.ord_sub_total as orderSubTotal",


        )

    return replacementOrders;
};




export const getsAllOutOfStockProducts = async () => {

    const outOfStockProducts = await db("product_inventory")

        .leftJoin("products", "product_inventory.product_id", "products.id")

        .select(
            "products.id as productId",
            "product_inventory.stock_availability as stockAvailability",
        )

        .where("product_inventory.stock_availability", "Out of stock");

    return outOfStockProducts;
};



export const getsAllExpiredProducts = async () => {

    const currentDate = new Date();

    const expiredProducts = await db("products")

        .where("products.prd_expiry_date", "<", currentDate)
        .andWhere('products.prd_dashboard_status', '=', true)
        .andWhere('products.show_expiry_on_dashboard', '=', true)

        .select(

            "products.id as productId",
            "products.prd_expiry_date as expiryDate",
            "products.prd_dashboard_status as dashboardStatus"

        );

    return expiredProducts;
};


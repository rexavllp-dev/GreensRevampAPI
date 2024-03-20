import db from "../../config/dbConfig.js";



// get total orders
export const getsAllTotalOrders = async () => {
    const totalOrders = await db("user_orders")

        .select(
            db.raw("COUNT(CASE WHEN user_orders.ord_order_status = 1 THEN 1 END) as pending_count"),
            db.raw("COUNT(CASE WHEN user_orders.ord_order_status = 5 THEN 1 END) as completed_count"),
            db.raw("COUNT(CASE WHEN user_orders.ord_order_status = 6 THEN 1 END) as canceled_count")
        )
        .first();

    return totalOrders;
};


// get recent orders
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


    const totalRecentOrders = await db("user_orders")
        .count("* as totalCount")
        .first();

    return {

        orders,
        totalCount: totalRecentOrders.totalCount

    };

};

// get latest cancelled orders
export const getsLatestCancelledOrders = async () => {

    const canceledOrders = await db("cancel_orders")



        .select('*')
        .orderBy("cancel_orders.created_at", "desc");

    return canceledOrders;

};


// get  latest returned orders
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

    const totalReturnedOrders = await db("return_products")
        .count("* as totalCount")
        .first();

    return {

        returnedOrders,
        totalCount: totalReturnedOrders.totalCount

    };


};




// get latest replacement orders
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

    const totalReplacementOrders = await db("replace_products")
        .count("* as totalCount")
        .first();


    return {

        replacementOrders,
        totalCount: totalReplacementOrders.totalCount

    };
};



// get all out of stock products
export const getsAllOutOfStockProducts = async () => {

    const outOfStockProducts = await db("product_inventory")

        .leftJoin("products", "product_inventory.product_id", "products.id")

        .select(
            "products.id as productId",
            "product_inventory.stock_availability as stockAvailability",


            "products.prd_name as productName",
        )

        .where("product_inventory.stock_availability", "Out of stock");

    const totalOutOfStock = await db("product_inventory")
        .count("* as totalCount")
        .where("product_inventory.stock_availability", "Out of stock")
        .first();


    return {

        outOfStockProducts,
        totalCount: totalOutOfStock.totalCount

    };
};


// get all expired products
export const getsAllExpiredProducts = async () => {

    const currentDate = new Date();

    const expiredProducts = await db("products")

        .where("products.prd_expiry_date", "<", currentDate)
        .andWhere('products.prd_dashboard_status', '=', true)
        .andWhere('products.show_expiry_on_dashboard', '=', true)

        .select(

            "products.id as productId",
            "products.prd_name",
            "products.prd_expiry_date as expiryDate",
            "products.prd_dashboard_status as dashboardStatus"

        );

    const totalExpiredProducts = await db("products")
        .count("* as totalCount")
        .where("products.prd_expiry_date", "<", currentDate)
        .andWhere('products.prd_dashboard_status', '=', true)
        .andWhere('products.show_expiry_on_dashboard', '=', true)
        .first();


    return {

        expiredProducts,
        totalCount: totalExpiredProducts.totalCount
    };
};


// get all products with min qty
export const getsAllProductsMinQty = async () => {

    const products = await db("product_inventory")
        .leftJoin("products", "product_inventory.product_id", "products.id")
        .where("product_inventory.inventory_management", true)
        .andWhere(function () {
            this.where("product_inventory.product_quantity", "<=", db.raw("product_inventory.min_qty"))
        })

        .select(


            "product_inventory.id as inventoryId",
            "product_inventory.min_qty as minQty",
            "product_inventory.product_quantity as remainingStock",



            "products.id as productId",
            "products.prd_name",


        );


    const totalProductsMinQty = await db("product_inventory")
        .count("* as totalCount")
        .where("product_inventory.inventory_management", true)
        .andWhere(function () {
            this.where("product_inventory.product_quantity", "<=", db.raw("product_inventory.min_qty"))
        })
        .first();



    return {

        products,
        totalCount: totalProductsMinQty.totalCount

    };
};




// get all expired trade licenses
export const getsAllExpiredTradeLicenses = async () => {

    const currentDate = new Date();

    const expiredLicense = await db("company")

        .where("company.company_trade_license_expiry", "<", currentDate)

        .select(
            "company.id as companyId",
            "company.company_name",
            "company.company_trade_license_expiry as expiryDate",

        );


    const totalExpiredLicense = await db("company")
        .count("* as totalCount")
        .where("company.company_trade_license_expiry", "<", currentDate)
        .first();


    return {

        expiredLicense,
        totalCount: totalExpiredLicense.totalCount

    };

};

// get all total revenue

export const getAllTotalSales = async ({ fromDate, toDate }) => {

    let totalSales = db("user_orders")
        .where({ ord_order_status: 5 })
    if (fromDate && toDate) {
        
        totalSales.whereBetween('created_at', [fromDate.toString() , toDate.toString()])
    }


    totalSales.sum("ord_grand_total as totalSales")

    console.log(totalSales.toString())

    return await totalSales || 0;

}

// get sales bar chart

export const getSalesBarChart = async () => {
    // Initialize an object to store sales data for each day of the week
    const salesData = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0
    };

    try {
        // Calculate the start and end dates for the last week
        const endDate = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');
        const startDate = dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD');

        // Query the database for sales data for each day of the last week
        for (let day in salesData) {
            const totalSales = await db("user_orders")
                .where({ ord_order_status: 5 })
                .whereRaw(`DATE_TRUNC('day', created_at) = '${startDate}'::date`)
                .sum("ord_grand_total as totalSales")
                .first();

            // Store the total sales for the day in the salesData object
            salesData[day] = totalSales.totalSales || 0;

            // Move to the next day
            startDate = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');
        }

        return salesData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

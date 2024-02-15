import db from "../../config/dbConfig.js";


export const bulkInsert = async (bulkData) => {
    // Check if start_range is not provided, set it to the value of end_range
    bulkData.start_range = bulkData.start_range || bulkData.end_range;
    const bulk = await db('products_bulks').insert(bulkData);
    return bulk;
};


export const getPriceByProductIdAndCalculate = async (productId) => {
    const productPrice = await db('products_price')
        .where({ product_id: productId })
        .select(
            db.raw(`
    CASE 
        WHEN products_price.is_discount = 'false' THEN products_price.product_price
        WHEN products_price.is_discount = true AND CURRENT_TIMESTAMP BETWEEN DATE(products_price.special_price_start) AND DATE(products_price.special_price_end) THEN
            CASE 
                WHEN products_price.special_price_type = 'percentage' THEN products_price.product_price * (1 - (products_price.special_price / 100))
                WHEN products_price.special_price_type = 'fixed' THEN products_price.product_price - products_price.special_price
                ELSE 0
            END
        ELSE products_price.product_price
    END AS computed_price
`)

        )
        .first();
    return productPrice;
};

export const existingBulk = async (bulkData) => {
    const bulk = await db('products_bulks')
        .where('product_id', bulkData.product_id)
        .where('start_range', '<=', bulkData.end_range)
        .andWhere('end_range', '>=', bulkData.start_range)
        .first();

    return bulk;
};



export const existingBulkForUpdate = async (bulkData, bulkId) => {
    const bulk = await db('products_bulks')
        .where('product_id', bulkData.product_id)
        .where('start_range', '<=', bulkData.end_range)
        .whereNot('id', bulkId)
        .andWhere('end_range', '>=', bulkData.start_range)
        .first();

    return bulk;
}

export const updateBulk = async (bulkData, bulkId) => {
    const bulk = await db('products_bulks')
        .where({ id: bulkId })
        .update(bulkData);
    return bulk;
};




export const getABulk = async (bulkId) => {
    const bulk = await db('products_bulks')
        .where({ id: bulkId })
        .select('*')
        .first();

    return bulk;
};

export const getAllBulk = async () => {
    const bulk = await db('products_bulks')
        .select('*');
    return bulk;
};



export const deleteBulk = async (bulkId) => {
    const bulk = await db('products_bulks')
        .where({ id: bulkId })
        .del();
    return bulk;
};

// _______________________________________________________________________________________________________________________________________________________________________

export const createBulkAbove = async (bulkData) => {
    const bulk = await db('bulk_above_max_orders').insert(bulkData);
    return bulk;
};


export const getBulkAboveOrder = async (bulkId) => {
    const bulk = await db('bulk_above_max_orders')
        .where({ id: bulkId })
        .select('*')
        .first();

    return bulk;
};



export const getBulkByProductId = async (productId) => {
    const bulk = await db('products_bulks')
        .where({ product_id: productId })
        .crossJoin('vat')
        .select(
            'products_bulks.*',
            "vat.*",
            "vat.id as vat_id",
            db.raw('(products_bulks.discounted_price + (products_bulks.discounted_price * vat / 100)) as bulkPriceWithVat')
            )

    return bulk;
};



export const saveBulkOrderRequest = async (userId, productId, quantity) => {
    const saveBulk = await db('bulk_above_max_orders')
        .insert({
            user_id: userId,
            product_id: productId,
            quantity: quantity,
        });
    return saveBulk;
};



export const updateBulkRequest = async (bulkId, status) => {
    const bulk = await db('bulk_above_max_orders')
        .where({ id: bulkId })
        .update({ approved_status: status });

    return bulk
};


// Check if a bulk order request already exists for a user
export const isBulkOrderRequestExists = async (userId, productId) => {
    const existingRequest = await db('bulk_above_max_orders')
        .where({
            user_id: userId,
            product_id: productId
        })
        .first();
    return !!existingRequest; // Returns true if request exists, false otherwise
};


export const getBulkApproveStatusByProductId = async (userId, productId) => {
    const bulk = await db('bulk_above_max_orders')
    .where({
        user_id: userId,
        product_id: productId
    })
    .first();
return bulk;
}



// approve and reject Bulk Above Max Orders by admin
export const approveBulkMaxOrder = async (bulkId) => {
    return db('bulk_above_max_orders')
        .where({ id: bulkId })
        .update({ approved_status: "Accept" })


};

export const rejectBulkMaxOrder = async (bulkId) => {
    return db('bulk_above_max_orders')
        .where({ id: bulkId })
        .update({ approved_status: "Reject" })
};

// update bulk above max orders
export const updateBulkMaxOrderStatusAndQty = async (bulkId, newStatus, newQuantity) => {
    const updates = await db('bulk_above_max_orders')
        .where({ id: bulkId })
        .update({
            approved_status: newStatus,
            quantity: newQuantity
        })
    return updates;
};


export const getUserFromBulkOrder = async (bulkId) => {
    const user = await db('bulk_above_max_orders')
        .where({ 'bulk_above_max_orders.id': bulkId })
        .leftJoin('users', 'users.id', '=', 'bulk_above_max_orders.user_id')
        .leftJoin('products', 'products.id', '=', 'bulk_above_max_orders.product_id')
        .select(
            'users.*',
            'users.id as userId',
            'bulk_above_max_orders.*',
            'bulk_above_max_orders.id as bulkId',
            'products.*',
            'products.id as productId'
        )
        .first();


    console.log(user);

    return user;
};



// get all bulk request 
export const getBulkOrderRequests = async () => {
    const bulks = await db('bulk_above_max_orders')
        .join('users', 'users.id', '=', 'bulk_above_max_orders.user_id')
        .join('products', 'products.id', '=', 'bulk_above_max_orders.product_id')
        .select(
            'users.*',
            'users.id as userId',
            'bulk_above_max_orders.*',
            'bulk_above_max_orders.id as bulkId',
            'products.*',
            'products.id as productId'
        );
    return bulks;
};


export const getPreviousBulk = async (productId, startRange) => {
    const previousBulk = await db('products_bulks')
        .where('product_id', productId)
        .where('end_range', '<', startRange)
        .orderBy('end_range', 'desc')
        .first();

    return previousBulk;
};



export const getMaxQuantityByProductId = async (productId) => {
    const productInventory = await db('product_inventory')
        .select('max_qty')
        .where('product_id', productId)
        .first();

    return productInventory ? productInventory.max_qty : null;
};


export const getMinQuantityByProductId = async (productId) => {
    const productInventory = await db('product_inventory')
        .select('min_qty')
        .where('product_id', productId)
        .first();

    return productInventory ? productInventory.min_qty : null;
};
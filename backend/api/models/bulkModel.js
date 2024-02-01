import db from "../../config/dbConfig.js";


export const bulkInsert = async (bulkData) => {
    // Check if start_range is not provided, set it to the value of end_range
    bulkData.start_range = bulkData.start_range || bulkData.end_range;
    const bulk = await db('products_bulks').insert(bulkData);
    return bulk;
};

export const existingBulk = async (bulkData) => {
    const bulk = await db('products_bulks')
    .where('start_range', '<=', bulkData.end_range)
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
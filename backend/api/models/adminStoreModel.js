import db from "../../config/dbConfig.js";


export const createAStore = async (storeData) => {
    const store = await db('admin_store').insert(storeData).returning('*');
    return store;
};


export const updateAStore = async (storeId, storeData) => {
    const store = await db('admin_store')
        .where({ ad_store_id: storeId })
        .update(storeData)
        .returning('*');

    return store;
};


export const getAStore = async (storeId) => {
    const storeData = await db('admin_store')
        .where({ ad_store_id: storeId })
        .select('*')
        .first();

    return storeData;
};


export const getsAllStore = async () => {
    const storeData = await db('admin_store')
        .select('*');

    return storeData;
};
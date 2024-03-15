import db from "../../config/dbConfig.js";


export const createAdminStorePickup = async (data) => {

    const response = await db("admin_store_pickup").insert(data);

    return response;
};



export const updateAdminStorePickup = async (storePickupId, data) => {

    const response = await db("admin_store_pickup")
        .where({ store_pickup_id: storePickupId })
        .update(data)
        .returning('*');

    return response;
};



export const getAStorePickup = async (storePickupId) => {

    const response = await db("admin_store_pickup")
        .where({ store_pickup_id: storePickupId })
        .select('*');

    return response;
};


export const getsAllStorePickup = async () => {

    const response = await db("admin_store_pickup")
        .select();

    return response;
};

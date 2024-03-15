import db from "../../config/dbConfig.js";


export const createAdminStorePickupCharge = async (data) => {

    const response = await db("admin_store_pickup_with_charge").insert(data);

    return response;
};



export const updateAdminStorePickupCharge = async (storePickupChargeId, data) => {

    const response = await db("admin_store_pickup_with_charge")
        .where({ store_pickup_id: storePickupChargeId })
        .update(data)
        .returning('*');

    return response;
};



export const getAStorePickupCharge = async (storePickupChargeId) => {

    const response = await db("admin_store_pickup_with_charge")
        .where({ store_pickup_id: storePickupChargeId })
        .select('*');

    return response;
};


export const getsAllStorePickupCharge = async () => {

    const response = await db("admin_store_pickup_with_charge")
        .select();

    return response;
};

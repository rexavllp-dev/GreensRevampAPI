import db from "../../config/dbConfig";



export const createStorePickupWithCharge = async (data) => {

    const response = await db("admin_store_pickup_with_charge").insert(data);

    return response;
};


export const updateStorePickupWithCharge = async (data, storePickupWithChargeId) => {

    const response = await db("admin_store_pickup_with_charge")
        .where({ store_pickup_with_charge_id: storePickupWithChargeId })
        .update(data)
        .returning('*');

    return response;
};


export const getAStorePickupWithCharge = async (storePickupWithChargeId) => {

    const response = await db("admin_store_pickup_with_charge")
        .where({ store_pickup_with_charge_id: storePickupWithChargeId })
        .select('*');

    return response;
};



export const getAllStorePickupWithCharge = async () => {

    const response = await db("admin_store_pickup_with_charge")
        .select();

    return response;

};
















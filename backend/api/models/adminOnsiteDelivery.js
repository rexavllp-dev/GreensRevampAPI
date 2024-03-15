import db from "../../config/dbConfig.js";


export const createAdminOnsiteDelivery = async (data) => {

    const response = await db("admin_onsite_delivery").insert(data);

    return response;
};


export const updateAdminOnsiteDelivery = async (onsiteDeliveryId, data) => {

    const response = await db("admin_onsite_delivery")
        .where({ onsite_delivery_id: onsiteDeliveryId })
        .update(data)
        .returning('*');

    return response;
};



export const getAnOnsiteDelivery = async (onsiteDeliveryId) => {

    const response = await db("admin_onsite_delivery")
        .where({ onsite_delivery_id: onsiteDeliveryId })
        .select('*');

    return response;
};


export const getAllOnsiteDelivery = async () => {

    const response = await db("admin_onsite_delivery")
        .select();

    return response;
};

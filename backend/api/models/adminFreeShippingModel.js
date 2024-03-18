import db from "../../config/dbConfig.js";


export const createAdminFreeShipping = async (data) => {

    const response = await db("admin_free_shipping").insert(data);

    return response;
};


export const updateAdminFreeShipping = async (data, shippingId) => {

    const response = await db("admin_free_shipping")
        .where({ free_shipping_id: shippingId })
        .update(data);

    return response;
};


export const getAFreeShipping = async (shippingId) => {

    const response = await db("admin_free_shipping")
        .where({ free_shipping_id: shippingId })
        .select('*');

    return response;
};


export const getsAllFreeShipping = async () => {

    const response = await db("admin_free_shipping")
        .select();

    return response;
};
import db from '../../config/dbConfig.js';


export const addDeliveryEstimate = async (data) => {
    return await db('delivery_estimate').insert(data);
};

export const updateADeliveryEstimate = async (deliveryEstimateId, data) => {
    return await db('delivery_estimate').where({ id: deliveryEstimateId }).update(data);
};


export const getADeliveryEstimate = async (deliveryEstimateId) => {
    return await db('delivery_estimate').where({ id: deliveryEstimateId }).first();
};


export const getAllDeliveryEstimate = async () => {
    return await db('delivery_estimate').select('*');
};


export const deleteADeliveryEstimate = async (deliveryEstimateId) => {
    return await db('delivery_estimate').where({ id: deliveryEstimateId }).del();
};
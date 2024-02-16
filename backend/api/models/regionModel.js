import db from '../../config/dbConfig.js';


export const addRegion = async (data) => {
    return await db('regions').insert(data);
};

export const updateARegion = async (regionId, data) => {
    return await db('regions').where({ id: regionId }).update(data);
};


export const getARegion = async (regionId) => {
    return await db('regions').where({ id: regionId }).first();
};


export const getAllRegion = async () => {
    return await db('regions').select('*');
};


export const deleteARegion = async (regionId) => {
    return await db('regions').where({ id: regionId }).del();
};
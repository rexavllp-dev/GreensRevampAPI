import db from '../../config/dbConfig.js';


export const createAAds = async (adsData) => {
    const ads = await db('homepage_ads')
        .insert(adsData)
        .returning('*');

    return ads;
};


export const updateAAds = async (adsId, adsData) => {
    const ads = await db('homepage_ads')
        .where({ ads_id: adsId })
        .update(adsData)
        .returning('*');

    return ads;
};


export const getAAds = async (adsId) => {
    const ads = await db('homepage_ads')
        .where({ ads_id: adsId })
        .select('*');
    return ads;
};


export const getsAllAdss = async () => {
    const adss = await db('homepage_ads').select('*');
    return adss;
};


export const deleteAAds = async (adsId) => {
    const ads = await db('homepage_ads')
        .where({ ads_id: adsId })
        .del()
        .returning('*');

    return ads;
};
import db from '../../config/dbConfig.js';


export const createABanner = async (bannerData) => {
    const banner = await db('homepage_banners')
        .insert(bannerData)
        .returning('*');

    return banner;
};


export const updateABanner = async (bannerId, bannerData) => {
    const banner = await db('homepage_banners')
        .where({ banner_id: bannerId })
        .update(bannerData)
        .returning('*');

    return banner;
};


export const getABanner = async (bannerId) => {
    const banner = await db('homepage_banners')
        .where({ banner_id: bannerId })
        .select('*');
    return banner;
};


export const getAllBanners = async () => {
    const banners = await db('homepage_banners').select('*');
    return banners;
};


export const deleteABanner = async (bannerId) => {
    const banner = await db('homepage_banners')
        .where({ banner_id: bannerId })
        .del()
        .returning('*');

    return banner;
};
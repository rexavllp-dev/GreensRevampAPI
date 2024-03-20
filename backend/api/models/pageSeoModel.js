import db from '../../config/dbConfig.js';

export const createAPageSeo = async (pageSeoData) => {

    const newPageSeo = await db('pages_seo')
        .insert(pageSeoData)
        .returning('*');
    return newPageSeo;
};


export const updateAPageSeo = async (pageSeoId, pageSeoData) => {

    const pageSeo = await db('pages_seo')
        .where('page_seo_id', pageSeoId)
        .update(pageSeoData)
        .returning('*');

    return pageSeo;
};



export const getAPageSeo = async (pageSeoId) => {
    const pageSeo = await db('pages_seo')
        .where('page_seo_id', pageSeoId)
        .select('*')
        .first();

    return pageSeo;
};



export const getsAllPageSeos = async () => {

    const pageSeos = await db('pages_seo')
        .select('*');

    return pageSeos;
};



export const deleteAPageSeo = async (pageSeoId) => {
    const pageSeo = await db('pages_seo')
        .where('page_seo_id', pageSeoId)
        .del()
        .returning('*');

    return pageSeo;

};


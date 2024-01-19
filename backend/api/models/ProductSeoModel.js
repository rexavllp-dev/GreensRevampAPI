import db from '../../config/dbConfig.js';


// create seo
export const createSeo = async (seoData) => {
    const seo = await db('product_seo').insert(seoData).returning('*');
    return seo;
};

// update seo
export const updateASeo = async (seoId, updatedData) => {
    const updatedSeo = await db('product_seo').where({ id: seoId }).update(updatedData).returning('*');
    return updatedSeo;
};


// get seo by id
export const getSeoById = async (seoId) => {
    const seo = await db('product_seo').select('*').where({ id: seoId }).first();
    return seo;
};


// get all seo
export const getSeo = async () => {
    const seo = await db('product_seo').select('*');
    return seo;
};


// delete seo 
export const deleteASeo = async (seoId) => {
    const seo = await db('product_seo').where({ id: seoId }).del();
    return seo;
}

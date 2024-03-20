import db from '../../config/dbConfig.js';

export const createAPage = async (pageData) => {

    const newPage = await db('pages')
        .insert(pageData)
        .returning('*');
    return newPage;
};


export const updateAPage = async (pageId, pageData) => {

    const page = await db('pages')
        .where('page_id', pageId)
        .update(pageData)
        .returning('*');

    return page;
};



export const getAPage = async (pageId) => {
    const page = await db('pages')
        .where('page_id', pageId)
        .select('*')
        .first();

    return page;
};



export const getsAllPages = async () => {

    const pages = await db('pages')
        .select('*');

    return pages;
};



export const deleteAPage = async (pageId) => {
    const page = await db('pages')
        .where('page_id', pageId)
        .del()
        .returning('*');

    return page;

};


import db from '../../config/dbConfig.js';


export const createVariants = async (variantsData) => {
    const variants = await db('variants').insert(variantsData).returning('*');
    return variants;
};

export const getVariantsById = async (variantsId) => {
    const variants = await db('variants').select('*').where({ id: variantsId }).first();
    return variants;
};


export const getVariants = async () => {
    const variants = await db('variants').select('*');
    return variants;
};


export const deleteAVariants = async (variantsId) => {
    const deleteVariants = db('variants').where({ id: variantsId }).del();
    return deleteVariants;
};
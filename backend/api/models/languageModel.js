import db from '../../config/dbConfig.js';


export const createLanguage = async (data) => {
    const language = await db('languages').insert(data).returning('*');
    return language;
};

export const getLanguageById = async (languageId) => {
    const language = await db('languages').where({ id: languageId }).select('*');
    return language;
};

export const getLanguages = async () => {
    const languages = await db('languages').select('*');
    return languages;
};
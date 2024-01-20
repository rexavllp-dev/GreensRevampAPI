import db from '../../config/dbConfig.js';


export const createOption = async (optionData) => {
    const option = await db('options').insert(optionData).returning('*');
    return option;
};


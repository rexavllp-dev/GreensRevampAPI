import db from '../../config/dbConfig.js';


export const createOption = async (optionData) => {
    const option = await db('options').insert(optionData).returning('*');
    return option;
};



export const deleteAOption = async (optionId) => {
    const deleteOption = db('options').where({ id: optionId }).del();
    return deleteOption;
}
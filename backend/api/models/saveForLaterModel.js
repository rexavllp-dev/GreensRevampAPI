import db from '../../config/dbConfig.js';



export const addSaveForLater = async (saveForLaterData) => {

    const newSaveForLater = await db('save_for_later').insert(saveForLaterData)
    .returning('*')
    return newSaveForLater; 
}



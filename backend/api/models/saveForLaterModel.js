import db from '../../config/dbConfig.js';


// add save for later
export const addSaveForLater = async (saveForLaterData) => {

    const newSaveForLater = await db('save_for_later').insert(saveForLaterData)
    .returning('*')
    return newSaveForLater; 
}


// get all save for later
export const getallSaveForLater = async () => {

    const allSaveForLater = await db('save_for_later')
    .select('*')
    return allSaveForLater
}


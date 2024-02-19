import db from '../../config/dbConfig.js';


// add save for later
export const addSaveForLater = async (saveforlaterdata) => {

    const newSaveForLater = await db('save_for_later').insert(saveforlaterdata)
    .returning('*')
    return newSaveForLater; 
}


// get all save for later
export const getallSaveForLater = async () => {

    const allSaveForLater = await db('save_for_later')
    .select('*')
    return allSaveForLater
}

// remove save for later
export const removeSaveForLater = async (saveforlaterId) => {   
    const removedSaveForLater = await db('save_for_later')
    .where({id: saveforlaterId})
    .del()
    return removedSaveForLater
}
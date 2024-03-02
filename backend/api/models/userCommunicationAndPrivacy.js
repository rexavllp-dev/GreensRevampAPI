import db from '../../config/dbConfig.js';



// update user communication and privacy
export const updateUserCommunicationAndPrivacy = async (userId, data) => {
    await db('users')
        .where({ id: userId })
        .update(data);
}


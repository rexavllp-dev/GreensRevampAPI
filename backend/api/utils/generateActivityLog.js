import db from '../../config/dbConfig.js';

export const generateActivityLog = async ({ userId, comment }) => {
    const newActivity = await db('user_activity')
        .insert({
            user_id: userId,
            comment: comment 
        });

    return newActivity;
}


import db from '../../config/dbConfig.js';

export const generateActivityLog = async ({ userId, comment }) => {
    const newActivity = await db('user_activity')
        .insert({
            ua_user_id: userId,
            ua_comment: comment 
        });

    return newActivity;
}


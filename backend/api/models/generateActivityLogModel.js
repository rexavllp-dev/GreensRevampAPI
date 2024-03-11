import db from '../../config/dbConfig.js';


// get all activity

export const getAllActivity = async () => {
    
    const allActivity = await db('user_activity')
    .leftJoin('users', 'user_activity.ua_user_id', 'users.id')
    .select (
         'user_activity.*',
         'users.*',
         'users.id as user_id'
        )
        
    return allActivity;
        
}
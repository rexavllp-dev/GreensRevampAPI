import db from '../../config/dbConfig.js';


// get all activity

export const getAllActivity = async () => {
    
    const allActivity = await db('user_activity')
    .leftJoin('users', 'user_activity.user_id', 'users.id')
    .select (
         'user_activity.*',
         'user_activity.id as user_activity_id',
         'users.*',
         'users.id as user_id'
        )
        
    return allActivity
        
}
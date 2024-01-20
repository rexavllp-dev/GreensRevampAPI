import db from '../../config/dbConfig.js';

export const createBadge = async (badgeData) => {
    const newBadge = await db('product_badge').insert(badgeData).returning('*')
    return newBadge ;
}



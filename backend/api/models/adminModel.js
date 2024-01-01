import db from '../../config/dbConfig.js';


export const isActive = async( userId ) => {
    await db('users').where({ id: userId }).update({ is_status: true });
}

export const isNotActive = async( userId ) => {
    await db('users').where({ id: userId }).update({ is_status: false });
}
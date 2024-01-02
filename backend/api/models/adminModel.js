import db from '../../config/dbConfig.js';


export const isActive = async( userId ) => {
    await db('users').where({ id: userId }).update({ is_status: true });
}

export const isNotActive = async( userId ) => {
    await db('users').where({ id: userId }).update({ is_status: false });
}

// if registered verification will be true

export const updateUserVerificationByAdmin = async (userId) => {
const user = await db('users').where({ id: userId }).update({ email_verified: true, mobile_verified: true });
return user;
};
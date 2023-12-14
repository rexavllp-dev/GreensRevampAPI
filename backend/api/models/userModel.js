import db from '../../config/dbConfig.js';

// creating a function createUser for register a user 
export const createUser = async (data) => {

    const newUser = await db("users").insert(data).returning('*');
    return newUser;

};




// login user 

export const getUserByEmail = async (usr_email) => {
    const user = await db("users").select("*").where({ usr_email }).first();
    return user;
}



export const updateUserVerificationStatus = async (userId, email_verified) => {
const updateUserVerification = await db("users").where({ id: userId }).update({ email_verified });
return updateUserVerification;
}






export const getUser = async (id) => {
    const user = await db("users").select("*").where({ id });
    return user;
};

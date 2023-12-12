import db from '../../config/dbConfig.js';


// creating a function createUser for register a user 
export const createUser = async (data) => {
    const newUser = await db("users").insert(data).returning('*');
    return newUser;
}
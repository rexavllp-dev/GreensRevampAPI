import db from '../../config/dbConfig.js';
import bcrypt from 'bcrypt'
// creating a function createUser for register a user 
// creating a function createUser for register a user
export const createUser = async (data) => {
    const { usr_password, ...otherData } = data;
    // Hash the password
    const hashedPassword = await bcrypt.hash(usr_password, 10);
    // Insert the user data with the hashed password
    const newUser = await db("users").insert({ ...otherData, usr_password: hashedPassword }).returning('*');
    return newUser;
}


//login user

export const getUserByEmail = async (usr_email) => {
    const user = await db("users").select("*").where({ usr_email }).first();
    return user;
}
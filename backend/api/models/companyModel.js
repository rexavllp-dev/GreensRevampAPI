import db from '../../config/dbConfig.js';


// creating a function createCompany for register a company
export const createCompany = async (usr_password) => {
    const newCompany = await db("company").insert({usr_password}).returning('*');
    return newCompany;
}



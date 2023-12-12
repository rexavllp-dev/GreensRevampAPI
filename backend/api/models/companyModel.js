import db from '../../config/dbConfig.js';


// creating a function createCompany for register a company
export const createCompany = async (data) => {
    const newCompany = await db("company").insert(data).returning('*');
    return newCompany;
}
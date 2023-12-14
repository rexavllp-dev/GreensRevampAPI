import db from '../../config/dbConfig.js';


// creating a function createCountry for register a country
export const createCountry = async (data) => {
    const newCountry = await db("countries").insert(data).returning('*');
    return newCountry;
};
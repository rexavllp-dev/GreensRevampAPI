import db from '../../config/dbConfig.js';


// create brand 
export const createABrand = async (brandData) => {
    const brand = await db('brands').insert(brandData).returning('*');
    return brand;
}
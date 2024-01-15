import db from '../../config/dbConfig.js';


// create price

export const createPrdPrice = async (priceData) => {
    const price = await db("products_price").insert(priceData).returning('*');
    return price;
}



// update price
export const updatePrdPrice = async (id, priceData) => {
    const price = await db("products_price").where({ id }).update(priceData).returning();
    return price;
};

// get a price
export const getPrdPrice = async (priceId) => {
    const price = await db("products_price").select('*').where({ id:priceId }).first();
    return price;
}

// get all price

export const getAllPrdPrice = async () => {
    const price = await db("products_price");
    return price;
}


// delete price

export const deletePrdPrice = async (priceId) => {
    const price = await db("products_price").where({ id:priceId }).del();
    return price;
}
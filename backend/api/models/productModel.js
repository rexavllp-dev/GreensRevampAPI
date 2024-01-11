// create product

export const createProducts = async (productData) => {
    const newUser = await db("products").insert(productData).returning('*');
    return newUser;
};






// ____________________________________________________________________________________________________________________________________________________________________________
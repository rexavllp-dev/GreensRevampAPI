import db from '../../config/dbConfig.js';


export const createARecipeProducts = async (recipeId, productId) => {

    recipeId = parseInt(recipeId);
    productId = parseInt(productId);

    const recipeProduct = await db("recipe_products")
        .insert({

            recipe_id: recipeId,
            product_id: productId

        })
        .returning("*");

    return recipeProduct;

};


export const updateARecipeProducts = async (recipeProductId, data) => {

    const recipeProduct = await db("recipe_products")
        .where({ recipe_product_id: recipeProductId })
        .update(data)
        .returning("*");

    return recipeProduct;
};



export const getARecipeProducts = async (recipeProductId) => {

    const recipeProduct = await db("recipe_products")
        .where({ recipe_product_id: recipeProductId })
        .first();

    return recipeProduct;
};


export const getsAllRecipeProducts = async () => {

    const recipe_products = await db("recipe_products")
        .select("*");

    return recipe_products;

};



export const deleteARecipeProducts = async (recipeProductId) => {

    const recipeProduct = await db("recipe_products")
        .where({ recipe_product_id: recipeProductId })
        .del();

    return recipeProduct;
};
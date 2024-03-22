import db from '../../config/dbConfig.js';


export const createARecipe = async (data) => {

    const recipe = await db("recipes")
        .insert(data)
        .returning("*");

    return recipe;

};


export const updateARecipe = async (recipeId, data) => {

    const recipe = await db("recipes")
        .where({ recipe_id: recipeId })
        .update(data)
        .returning("*");

    return recipe;
};



export const getARecipe = async (recipeId) => {

    const recipe = await db("recipes")
        .where({ recipe_id: recipeId })
        .first();

    return recipe;
};


export const getsAllRecipes = async () => {

    const recipes = await db("recipes")
        .select("*");

    return recipes;

};



export const deleteARecipe = async (recipeId) => {

    const recipe = await db("recipes")
        .where({ recipe_id: recipeId })
        .del();

    return recipe;
};
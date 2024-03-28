import db from '../../config/dbConfig.js';


export const createARecipeCategories = async (data) => {

    const recipeProduct = await db("recipe_categories")
        .insert(data)
        .returning("*");

    return recipeProduct;

};


export const updateARecipeCategories = async (recipeCategoryId, data) => {

    const recipeProduct = await db("recipe_categories")
        .where({ recipe_product_id: recipeCategoryId })
        .update(data)
        .returning("*");

    return recipeProduct;
};



export const getARecipeCategories = async (recipeCategoryId) => {

    const recipeProduct = await db("recipe_categories")
        .where({ recipe_product_id: recipeCategoryId })
        .first();

    return recipeProduct;
};


export const getsAllRecipeCategories = async () => {

    const recipeCategories = await db("recipe_categories")
        .leftJoin("recipes", "recipes.recipe_id", "recipe_categories.recipe_id")
        .leftJoin("categories", "categories.id", "recipe_categories.category_id")


        .select('*')


    return recipeCategories;

};



export const deleteARecipeCategories = async (recipeCategoryId) => {

    const recipeProduct = await db("recipe_categories")
        .where({ recipe_category_id: recipeCategoryId })
        .del();

    return recipeProduct;
};
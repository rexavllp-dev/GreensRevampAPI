import { createARecipeCategories, deleteARecipeCategories, getARecipeCategories, getsAllRecipeCategories, updateARecipeCategories } from "../models/recipeCategoryModel.js";
import { createARecipe, deleteARecipe, getARecipe, getsAllRecipes, updateARecipe } from "../models/recipeModel.js";
import { createARecipeProducts, deleteARecipeProducts, getsAllRecipeProductByRecipeId } from "../models/recipeProductsModel.js";
import uploadAndResizeImage from "../utils/uploadImage.js";




export const createRecipe = async (req, res) => {
    let { recipe_name, recipe_description, recipe_status } = req.body;

    const productIds = JSON.parse(req.body.productIds);

    const file = req.files;

    console.log(file);

    try {
        // Check if there's a file attached
        if (!file) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Image file is required"
            });
        };

        const imageUrl = await uploadAndResizeImage(file);

        const recipeData = {
            recipe_name,
            recipe_description,
            recipe_status,
            recipe_image: imageUrl
        };

        const newRecipe = await createARecipe(recipeData);

        let recipeId = newRecipe[0].recipe_id;
        recipeId = parseInt(recipeId);

        // if (!Array.isArray(productIds)) {
        //     throw new Error("productIds must be an array");
        // }

        for (const productId of productIds) {
            await createARecipeProducts(recipeId, productId);
        };

        res.status(200).json({
            status: 200,
            success: true,
            message: "Recipe created successfully",
            result: newRecipe
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create recipe",
            error: error
        });
    }
};



export const updateRecipe = async (req, res) => {

    const recipeId = req.params.recipeId;
    const data = req.body;

    try {

        const updatedRecipe = await updateARecipe(recipeId, data);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Recipe updated successfully",
            result: updatedRecipe
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update recipe",
            error: error
        });
    }
};



export const getRecipe = async (req, res) => {

    const recipeId = req.params.recipeId;

    try {

        const recipe = await getARecipe(recipeId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched recipe successfully",
            result: recipe
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch recipe",
            error: error
        });
    }
};



export const getAllRecipes = async (req, res) => {

    try {

        const recipes = await getsAllRecipes();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Create recipe successfully",
            result: recipes
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create recipe",
            error: error
        });
    }

};



export const deleteRecipe = async (req, res) => {

    const recipeId = req.params.recipeId;

    try {

        const deletedRecipe = await deleteARecipe(recipeId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Create recipe successfully",
            result: deletedRecipe
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create recipe",
            error: error
        });
    }
};



// recipe products 

// get all recipe products by recipe id
export const getAllRecipeProductsByRecipeId = async (req, res) => {

    const recipeId = req.params.recipeId;

    try {


        const recipeProducts = await getsAllRecipeProductByRecipeId(recipeId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Recipe products fetched successfully",
            result: recipeProducts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch recipe products",
            error: error
        });
    }
};

// delete recipe product
export const deleteRecipeProduct = async (req, res) => {

    const recipeProductId = req.params.recipeProductId;

    try {

        const deletedRecipeProduct = await deleteARecipeProducts(recipeProductId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Deleted recipe product successfully",
            result: deletedRecipeProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete recipe product",
            error: error
        });
    }
};



// __________________________________________________________________ Recipe Categories ____________________________________________________________________


export const createRecipeCategory = async (req, res) => {

    const recipeCategoryData = req.body;

    try {

        await createARecipeCategories(recipeCategoryData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "recipe category created successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create recipe category",
            error: error
        });
    }
};



// Update  RecipeCategory
export const updateRecipeCategory = async (req, res) => {

    const recipeCategoryData = req.body;
    const recipeCategoryId = req.params.recipeCategoryId;

    try {
        await updateARecipeCategories(recipeCategoryId, recipeCategoryData);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Recipe category updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update Recipe category",
            error: error
        });
    }
};

// GET SINGLE 
export const getSingleRecipeCategory = async (req, res) => {

    const recipeCategoryId = req.params.recipeCategoryId;

    try {
        const recipeCategory = await getARecipeCategories(recipeCategoryId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetch Recipe Category successfully",
            result: recipeCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch recipe category",
            error: error
        });
    }
};



export const getAllRecipeCategories = async (req, res) => {
    try {
        const recipeCategory = await getsAllRecipeCategories();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetch Recipe Category successfully",
            result: recipeCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch Recipe Category",
            error: error
        });
    }
};



export const deleteRecipeCategory = async (req, res) => {

    const recipeCategoryId = req.params.recipeCategoryId;

    try {

        const deletedRecipeProduct = await deleteARecipeCategories(recipeCategoryId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Deleted recipe product successfully",
            result: deletedRecipeProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete recipe product",
            error: error
        });
    }
};


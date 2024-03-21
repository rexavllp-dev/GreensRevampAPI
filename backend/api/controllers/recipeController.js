import { createARecipe, deleteARecipe, getARecipe, getsAllRecipes, updateARecipe } from "../models/recipeModel.js";
import uploadAndResizeImage from "../utils/uploadImage.js";




export const createRecipe = async (req, res) => {

    const data = req.body;
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
        
        data.recipe_image = imageUrl;

        const newRecipe = await createARecipe(data);

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
import { createAHomePageCategory,  deleteAHomePageCategory,  getAHomePageCategory, getsAllHomePageCategories } from "../models/homePageCategoryModel.js";



export const createHomePageCategory = async (req, res) => {

    const data = req.body;

    try {

        const newHomePageCategory = await createAHomePageCategory(data);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Home page category created successfully",
            result: newHomePageCategory
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create home page category",
            error: error
        });
    }
};



export const getHomePageCategory = async (req, res) => {

    const homepageCategoryId = req.params.homepageCategoryId;

    try {

        const newHomePageCategory = await getAHomePageCategory(homepageCategoryId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Home page category created successfully",
            result: newHomePageCategory
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create home page category",
            error: error
        });
    }
};




export const getAllHomePageCategories = async (req, res) => {


    try {

        const newHomePageCategory = await getsAllHomePageCategories();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Home page category created successfully",
            result: newHomePageCategory
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create home page category",
            error: error
        });
    }
};



export const deleteHomePageCategory = async (req, res) => {

    const homepageCategoryId = req.query.data;

    try {

        let categories = JSON.parse(homepageCategoryId);

        for (let i = 0; i < categories.length; i++) {
            await deleteAHomePageCategory(categories[i]);
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'categories deleted successfully',

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete categories. Please try again later.',
        });
    }
};
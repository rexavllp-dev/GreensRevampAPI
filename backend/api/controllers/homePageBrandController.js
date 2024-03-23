
import { createAHomePageBrand, deleteAHomePageBrand, getAHomePageBrand, getsAllHomePageBrands } from "../models/homePageBrandModel.js";



export const createHomePageBrand = async (req, res) => {

    const data = req.body;

    try {

        const newHomePageBrand = await createAHomePageBrand(data);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Home page brand created successfully",
            result: newHomePageBrand
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create home page brand",
            error: error
        });
    }
};



export const getHomePageBrand = async (req, res) => {

    const homepageBrandId = req.params.homepageBrandId;

    try {

        const newHomePageBrand = await getAHomePageBrand(homepageBrandId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Home page brand created successfully",
            result: newHomePageBrand
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create home page brand",
            error: error
        });
    }
};




export const getAllHomePageBrands = async (req, res) => {


    try {

        const homePageBrand = await getsAllHomePageBrands();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Home page brand fetched successfully",
            result: homePageBrand
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create home page brand",
            error: error
        });
    }
};



export const deleteHomePageBrand = async (req, res) => {

    const homepageBrandId = req.query.data;

    try {

        let brands = JSON.parse(homepageBrandId);

        for (let i = 0; i < brands.length; i++) {
            await deleteAHomePageBrand(brands[i]);
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'brands deleted successfully',

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete brands. Please try again later.',
        });
    }
};
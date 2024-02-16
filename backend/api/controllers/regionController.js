import { addRegion, getARegion, getAllRegion, updateARegion } from "../models/regionModel.js";


// CREATE A  region
export const createRegion = async (req, res) => {
    const regionData = req.body;
    try {
        await addRegion(regionData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "region created successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create region",
            error: error
        });
    }
};



// Update  region
export const updateRegion = async (req, res) => {

    const regionData = req.body;
    const regionId = req.params.regionId;

    try {
        await updateARegion(regionId, regionData);
        res.status(200).json({
            status: 200,
            success: true,
            message: "region updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update region",
            error: error
        });
    }
};

// GET SINGLE 
export const getSingleRegion = async (req, res) => {

    const regionId = req.params.regionId;

    try {
        const Region = await getARegion(regionId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetch region successfully",
            result: Region
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch region",
            error: error
        });
    }
};



export const getsAllRegion = async (req, res) => {
    try {
        const Region = await getAllRegion();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetch region successfully",
            result: Region
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch region",
            error: error
        });
    }
};
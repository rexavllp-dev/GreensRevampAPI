import { createCountry } from "../models/countryModels.js";




// creating a country functions 
export const registerCountry = async (req, res) => {
    try {
        const newCountry = await createCountry(req.body);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Country  registered  successfully!",
            result: newCountry,
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create country! Please try again later."
            
        });
    }
};
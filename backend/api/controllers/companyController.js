import { createCompany } from "../models/companyModel.js";



// creating a company functions 
export const registerCompany = async (req, res) => {
    try {
        const newCompany = await createCompany(req.body);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Company  registered  successfully!",
            result: newCompany,
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create company! Please try again later."
            
        });
    }
};
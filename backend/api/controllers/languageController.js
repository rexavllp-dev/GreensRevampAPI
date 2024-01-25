import { createLanguage, getLanguageById, getLanguages } from "../models/languageModel";



// create language
export const createALanguage = async (req, res) => {
    const { languageData } = req.body;
    try {
        const newLanguage = await createLanguage(languageData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Language created successfully",
            result: newLanguage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create language",
            error: error
        });
    }
};


// get a language 
export const getALanguage = async (req, res) => {
    const languageId = req.params.languageId;
    try {
        const language = await getLanguageById(languageId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Language fetched successfully",
            result: language
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch language",
            error: error
        });
    }
};


export const getAllLanguages = async (req, res) => {
    try {
        const languages = await getLanguages();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Language fetched successfully",
            result: languages
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch language",
            error: error
        });
    }
};
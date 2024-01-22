import { createANewProductLanguage, deleteALanguage, getLanguages, updateALanguage } from "../models/productLanguageModel.js";


export const createProductLanguage = async (req, res) => {
    try {
        const languageData = req.body;
        const newProductLanguage = await createANewProductLanguage(languageData);
        res.status(201).json({
            status: 201,
            success: true,
            message: "Product language created successfully",
            result: newProductLanguage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create product language",
            error: error
        });
    }

};



export const updateProductLanguage = async (req, res) => {
    const languageId = req.params.languageId;
    const updatedData = req.body;
    try {
        const updateLanguage = await updateALanguage(languageId, updatedData);
        if(!updateLanguage){
            return res.status(404).json({
              status:404,
              success:false,
              message:"Language not found"
              
            });
        }

        res.status(201).json({
            status: 201,
            success: true,
            message: "Product language created successfully",
            result: updateLanguage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update product language",
            error: error
        });
    }
};



// delete a language
export const deleteLanguage = async (req, res) => {
    const languageId = req.params.languageId;
    try {
        const deleteLanguage = await deleteALanguage(languageId);
        if(!deleteLanguage){
            return res.status(404).json({
              status:404,
              success:false,
              message:"Language not found"
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: "Language deleted successfully",
            result: deleteLanguage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete language",
            error: error
        });
    }
};


export const getAllProductLanguages = async (req, res) => {
    try {
        const productLanguages = await getLanguages();
        
        res.status(200).json({
          status:200,
          success:true,
          message:"Languages fetched successfully",
          result:productLanguages
        });
    } catch (error) {
        console.log(error);
res.status(500).json({
  status:500,
  success:false,
  message:"Failed to get product languages",
  error: error,
});
    }
}



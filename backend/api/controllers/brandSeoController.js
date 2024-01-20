import { createSeo, deleteASeo, getSeo, getSeoById, updateASeo } from "../models/brandSeoModel.js";




// create seo
export const addSeo = async (req, res) => {
    const seoData = req.body;
    try {
        const newSeo = await createSeo(seoData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Seo created successfully",
            result: newSeo
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create seo",
            error: error
        });
    }
};

// update seo
export const updateSeo = async (req, res) => {
    const  updatedData  = req.body;
    const seoId  = req.params.seoId;
    console.log(updatedData);

    try {
        const updatedSeo = await updateASeo(seoId, updatedData);

        if(!updatedSeo) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Seo not found"
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: "Seo updated successfully",
            result: updatedSeo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update seo",
            error: error
        });
    }
};

// get all seo
export const getAllSeo = async (req, res) => {
    try {
        const seo = await getSeo();

        res.status(200).json({
            status: 200,
            success: true,
            message: "successfully fetched seo",
            result: seo
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch seo",
            error: error
        });
    }
};


// get  single seo
export const getSingleSeo = async (req, res) => {
    const  seoId  = req.params.seoId;
    try {
        const seo = await getSeoById(seoId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Seo fetched successfully",
            result: seo
        });
    } catch (error) {
        console.log(Error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch seo",
            error: error
        });
    }
};



// delete seo 
export const deleteSeo = async (req, res) => {
    const  seoId  = req.params.seoId;
    try {
        const seo = await deleteASeo(seoId);

    res.status(200).json({
      status:200,
      success:true,
      message:"Successfully deleted seo",
      result:seo
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          status:500,
          success:false,
          message:"Failed to delete seo",
          error:error
        });
    }
}
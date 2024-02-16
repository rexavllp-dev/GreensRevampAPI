import { addSaveForLater } from "../models/saveForLaterModel.js";

 


export const createSaveForLater = async (req, res) => {

    const saveForLaterData = req.body;

    try {


    const newSaveForLater = await addSaveForLater(saveForLaterData);
    res.status (200).json({
        status: 200,
        success: true,
        result: newSaveForLater,
        Message: 'Save for later added successfully'
    })

    } catch (error) {
        
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to add save for later. Please try again later.'
        })
    }
}
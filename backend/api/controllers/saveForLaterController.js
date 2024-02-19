import { addSaveForLater, getallSaveForLater, removeSaveForLater } from "../models/saveForLaterModel.js";




export const createSaveForLater = async (req, res) => {

    const saveforLaterdata = req.body;

    try {


        const newSaveForLater = await addSaveForLater(saveforlaterdata);
        res.status(200).json({
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

//  get all save for later

export const getAllSaveForLaterProduct = async (req, res) => {

    try {
        const allSaveForLater = await getallSaveForLater();
        res.status(200).json({
            status: 200,
            success: true,
            result: allSaveForLater
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to get save for later. Please try again later.'
        })
    }
}

// remove save for later products

export const removedSaveForLater = async (req, res) => {

    const saveforlaterId = req.params.saveforlaterId;

    try {

        const removedSaveForLater = await removeSaveForLater(saveforlaterId);

        res.status(200).json({
            status: 200,
            success: true,
            result: removedSaveForLater,
            message: 'Save for later removed successfully'
        })

    } catch (error) {

        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            result: removedSaveForLater,
            message: 'Failed to remove save for later. Please try again later.'
        })
    }

}
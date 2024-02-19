import { addSaveForLater, getUserSaveForLater, getallSaveForLater, removeSaveForLater } from "../models/saveForLaterModel.js";




export const createSaveForLater = async (req, res) => {

    const saveForLaterData = req.body;
    const userId = req.user.userId;

    try {
        
        const userSaveForLater = await getUserSaveForLater(userId);

        const newSaveForLater = await addSaveForLater(saveForLaterData);
        res.status(200).json({
            status: 200,
            success: true,
            result: newSaveForLater,
            message: 'Save for later added successfully'
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

    const userId = req.user.userId;

    try {
        const allSaveForLater = await getallSaveForLater(userId);
        res.status(200).json({
            status: 200,
            success: true,
            result: allSaveForLater,
            message : 'All save for later products'
        })
    } catch (error) {
        console.log(error)
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

    const saveForLaterId = req.params.saveForLaterId;

    try {

        const removedSaveForLater = await removeSaveForLater(saveForLaterId);

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
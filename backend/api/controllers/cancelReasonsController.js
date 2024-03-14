import {
    createCancelReason,
    deleteCancelReason,
    getCancelReasonById,
    getCancelReasons,
    getCancelReasonsByType,
    updateCancelReason
}
    from "../models/cancelReasonsModel.js";

// create cancel reasons
export const createCancelReasons = async (req, res) => {
    const cancelReasonData = req.body;

    try {
        const newCancelReason = await createCancelReason(cancelReasonData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Cancel Reason created successfully",
            result: newCancelReason
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create cancel reason",
        })
    }
}

// update cancel reasons
export const updateCancelReasons = async (req, res) => {
    const { id } = req.params;
    const cancelReasonData = req.body;

    try {
        const updatedCancelReason = await updateCancelReason(id, cancelReasonData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Cancel Reason updated successfully",
            result: updatedCancelReason
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update cancel reason",
        })
    }
}


// get all cancel reasons
export const getCancelReason = async (req, res) => {
    try {
        let Reasons = [];
        const type = req.query.type;
        if (req.query.type) {

            Reasons =  await getCancelReasonsByType(type);
            res.status(200).json({
                status: 200,
                success: true,
                message: "Reasons Type fetched successfully",
                result: Reasons
            })
       
        } else {

            Reasons = await getCancelReasons();
            res.status(200).json({
                status: 200,
                success: true,
                message: " Reasons fetched successfully",
                result: Reasons
            })
    
        }
      
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch cancel reasons",
        })
    }

}



// get cancel reasons by id
export const getCancelReasonByIds = async (req, res) => {
    const { id } = req.params;

    try {
        const cancelReason = await getCancelReasonById(id);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Cancel Reason fetched successfully",
            result: cancelReason
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch cancel reason",
        })
    }

}



// delete cancel reasons
export const deleteCancelReasons = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCancelReason = await deleteCancelReason(id);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Cancel Reason deleted successfully",
            result: deletedCancelReason
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete cancel reason",
        })
    }

}
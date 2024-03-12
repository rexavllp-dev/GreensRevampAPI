import { getAllActivity } from "../models/generateActivityLogModel.js";


// get all activity



export const getAllActivityOfUser = async (req, res) => {

    try {

        const getActivity = await getAllActivity();

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Activity retrieved successfully',
            result: getActivity,
        })

    } catch (error) {
        console.log(error)
       return res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to get activity. Please try again later.'
        })
    }

}
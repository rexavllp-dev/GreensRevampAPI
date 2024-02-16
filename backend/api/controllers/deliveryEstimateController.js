import { addDeliveryEstimate, getADeliveryEstimate, getAllDeliveryEstimate, updateADeliveryEstimate } from "../models/deliveryEstimateModel.js";



// CREATE A  DELIVERY ESTIMATE
export const createDeliveryEstimate = async (req, res) => {
    const deliveryEstimateData = req.body;
    try {
        await addDeliveryEstimate(deliveryEstimateData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Delivery Estimate created successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create delivery estimate",
            error: error
        });
    }
};



// Update  delivery estimate
export const updateDeliveryEstimate = async (req, res) => {

    const deliveryEstimateData = req.body;
    const deliveryEstimateId = req.params.deliveryEstimateId;

    try {
        await updateADeliveryEstimate(deliveryEstimateId, deliveryEstimateData);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Delivery estimate updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update delivery estimate",
            error: error
        });
    }
};

// GET SINGLE 
export const getSingleDeliveryEstimate = async (req, res) => {

    const deliveryEstimateId = req.params.deliveryEstimateId;

    try {
        const deliveryEstimate = await getADeliveryEstimate(deliveryEstimateId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetch delivery estimate successfully",
            result: deliveryEstimate
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch delivery estimate",
            error: error
        });
    }
};



export const getsAllDeliveryEstimate = async (req, res) => {
    try {
        const deliveryEstimate = await getAllDeliveryEstimate();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetch delivery estimate successfully",
            result: deliveryEstimate
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch delivery estimate",
            error: error
        });
    }
};
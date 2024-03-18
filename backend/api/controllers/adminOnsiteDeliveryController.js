import { createAdminOnsiteDelivery, getAnOnsiteDelivery, updateAdminOnsiteDelivery } from "../models/adminOnsiteDelivery.js";



export const createOnsiteDelivery = async (req, res) => {

    const onSiteDeliveryData = req.body;

    try {

        const onSiteDelivery = await createAdminOnsiteDelivery(onSiteDeliveryData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Onsite delivery created successfully",
            result: onSiteDelivery
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create on site delivery",
            error: error
        });
    }
};



export const updateOnsiteDelivery = async (req, res) => {

    const onSiteDeliveryId = req.params.onSiteDeliveryId;
    const onSiteDeliveryData = req.body;

    try {

        const onSiteDelivery = await updateAdminOnsiteDelivery(onSiteDeliveryId, onSiteDeliveryData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Onsite delivery updated successfully",
            result: onSiteDelivery
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update on site delivery",
            error: error
        });
    }
};



export const getOnsiteDelivery = async (req, res) => {

    const onSiteDeliveryId = req.params.onSiteDeliveryId;

    try {

        const onSiteDelivery = await getAnOnsiteDelivery(onSiteDeliveryId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "On site delivery fetched successfully",
            result: onSiteDelivery
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch on site delivery",
            error: error
        });
    }
};



export const getAllOnsiteDelivery = async (req, res) => {

    try {

        const onSiteDelivery = await getAllOnsiteDelivery();
        res.status(200).json({
            status: 200,
            success: true,
            message: "On site delivery fetched successfully",
            result: onSiteDelivery
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch on site delivery",
            error: error
        });
    }
};
import { createAdminFreeShipping, getAFreeShipping, getsAllFreeShipping, updateAdminFreeShipping } from "../models/adminFreeShippingModel.js";


export const createFreeShipping = async (req, res) => {

    const shippingData = req.body;

    try {

        const shipping = await createAdminFreeShipping(shippingData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Free shipping created successfully",
            result: shipping
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create free shipping",
            error: error
        });
    }
};



export const updateFreeShipping = async (req, res) => {

    const shippingId = req.params.shippingId;
    const shippingData = req.body;

    try {

        const freeShipping = await updateAdminFreeShipping(shippingData, shippingId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Free shipping updated successfully",
            result: freeShipping
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update free shipping",
            error: error
        });
    }
};



export const getFreeShipping = async (req, res) => {

    const shippingId = req.params.shippingId;

    try {

        const freeShipping = await getAFreeShipping(shippingId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Free shipping found successfully",
            result: freeShipping
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get free shipping",
            error: error
        });
    }

};



export const getAllFreeShipping = async (req, res) => {

    try {

        const freeShipping = await getsAllFreeShipping();
        res.status(200).json({
            status: 200,
            success: true,
            message: "Free shipping found successfully",
            result: freeShipping
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get free shipping",
            error: error
        });
    }
};
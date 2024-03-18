import { createAdminStorePickup, getAStorePickup, getsAllStorePickup, updateAdminStorePickup } from "../models/adminStorePickupModel.js";


export const createStorePickup = async (req, res) => {

    const storePickupData = req.body;

    try {

        const storePickup = await createAdminStorePickup(storePickupData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store pickup created successfully",
            result: storePickup
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create store pickup",
            error: error
        });
    }

};



export const updateStorePickup = async (req, res) => {

    const storePickupId = req.params.storePickupId;
    const storePickupData = req.body;

    try {

        const storePickup = await updateAdminStorePickup(storePickupId, storePickupData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store pickup updated successfully",
            result: storePickup
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update store pickup",
            error: error
        });
    }
};



export const getStorePickup = async (req, res) => {

    const storePickupId = req.params.storePickupId;

    try {

        const storePickup = await getAStorePickup(storePickupId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store pickup retrieved successfully",
            result: storePickup
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to retrieve store pickup",
            error: error
        });
    }

};


export const getAllStorePickup = async (req, res) => {

    try {
        
        const storePickup = await getsAllStorePickup();
        res.status(200).json({
          status:200,
          success:true,
          message:"Store pickup retrieved successfully",
          result: storePickup
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to retrieve store pickup",
            error: error
        });
    }
};



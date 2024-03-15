import { createAdminStorePickupCharge, getAStorePickupCharge, getsAllStorePickupCharge, updateAdminStorePickupCharge } from "../models/adminStorePickupChargeModel.js";




export const createStorePickupCharge = async (req, res) => {

    const storePickupChargeData = req.body;

    try {

        const storePickupCharge = await createAdminStorePickupCharge(storePickupChargeData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store pickup created successfully",
            result: storePickupCharge
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



export const updateStorePickupCharge = async (req, res) => {

    const storePickupChargeId = req.params.storePickupChargeId;
    const storePickupChargeData = req.body;

    try {

        const storePickupCharge = await updateAdminStorePickupCharge(storePickupChargeId, storePickupChargeData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store pickup updated successfully",
            result: storePickupCharge
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



export const getStorePickupCharge = async (req, res) => {

    const storePickupChargeId = req.params.storePickupChargeId;

    try {

        const storePickupCharge = await getAStorePickupCharge(storePickupChargeId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store pickup retrieved successfully",
            result: storePickupCharge
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


export const getAllStorePickupCharge = async (req, res) => {

    try {
        
        const storePickupCharge = await getsAllStorePickupCharge();
        res.status(200).json({
          status:200,
          success:true,
          message:"Store pickup retrieved successfully",
          result: storePickupCharge
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



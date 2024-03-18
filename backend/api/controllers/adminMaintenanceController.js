import { createAMaintenance, getAMaintenance, getsAllMaintenance, updateAMaintenance } from "../models/adminMaintenanceModel.js";


export const createMaintenance = async (req, res) => {
    const maintenanceData = req.body;

    try {

        const maintenance = await createAMaintenance(maintenanceData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Maintenance created successfully",

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create maintenance",
            error: error
        });
    }

};



export const updateMaintenance = async (req, res) => {

    const maintenanceId = req.params.maintenanceId;
    const maintenanceData = req.body;

    try {

        const maintenance = await updateAMaintenance(maintenanceId, maintenanceData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Maintenance updated successfully",
            result: maintenance
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update maintenance",
            error: error
        });
    }
};



export const getMaintenance = async (req, res) => {

    const maintenanceId = req.params.maintenanceId;

    try {

        const maintenance = await getAMaintenance(maintenanceId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Maintenance fetched successfully",
            result: maintenance
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch maintenance",
            error: error
        });
    }
};



export const getAllMaintenance = async (req, res) => {

    try {

        const maintenances = await getsAllMaintenance();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Maintenances fetched successfully",
            result: maintenances
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch maintenances",
            error: error
        });
    }
};
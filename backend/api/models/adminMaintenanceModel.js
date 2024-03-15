import db from '../../config/dbConfig.js';


export const createAMaintenance = async (maintenanceData) => {
    const maintenance = await db('admin_maintenance').insert(maintenanceData);
    return maintenance;
};


export const updateAMaintenance = async (maintenanceId, maintenanceData) => {
    const maintenance = await db('admin_maintenance').where({ maintenance_id: maintenanceId }).update(maintenanceData);
    return maintenance;
};


export const getAMaintenance = async (maintenanceId) => {
    const maintenanceData = await db('admin_maintenance')
        .where({ maintenance_id: maintenanceId })
        .select('*')
        .first();

    return maintenanceData;
};


export const getsAllMaintenance = async () => {
    const maintenanceData = await db('admin_maintenance')
        .select('*');
    return maintenanceData;
};



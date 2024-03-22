import { createARole, getsAllRoles, updateARole } from "../models/userRolesModel.js";


export const createRole = async (req, res) => {

    const data = req.body

    try {

        const role = await createARole(data);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Roles created successfully",
            result: role
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create roles",
            error: error
        });
    }
};


export const updateRole = async (req, res) => {

    const roleId = req.params.roleId;
    const data = req.body;

    try {

        const updatedRole = await updateARole(roleId, data);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Role updated successfully",
            result: updatedRole
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update role",
            error: error
        });
    }

};



export const getAllRoles = async (req, res) => {

    try {

        const roles = await getsAllRoles();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Roles fetched successfully",
            result: roles
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch roles",
            error: error
        });
    }

};
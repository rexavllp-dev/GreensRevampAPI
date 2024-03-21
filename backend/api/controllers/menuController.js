import { createAMenu, deleteAMenu, getAMenu, getsAllMenus, updateAMenu } from "../models/menuModel.js";





export const createMenu = async (req, res) => {

    const menuData = req.body;

    try {

        const newMenu = await createAMenu(menuData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "New menu created successfully",
            result: newMenu
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create menu",
            error: error
        });
    }

};




export const updateMenu = async (req, res) => {

    const menuId = req.params.menuId;
    const menuData = req.body;

    try {

        const updatedMenu = await updateAMenu(menuId, menuData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "menu updated successfully",
            result: updatedMenu
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update menu",
            error: error
        });
    }

};



export const getMenu = async (req, res) => {

    const menuId = req.params.menuId;

    try {

        const menu = await getAMenu(menuId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "menu fetched successfully",
            result: menu
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch menu",
            error: error
        });
    }

};


export const getAllMenus = async (req, res) => {

    try {

        const menus = await getsAllMenus();

        res.status(200).json({
            status: 200,
            success: true,
            message: "menus fetched successfully",
            result: menus
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch menus",
            error: error
        });
    }
};



export const deleteMenu = async (req, res) => {

    const menuId = req.params.menuId;

    try {

        const deletedMenu = await deleteAMenu(menuId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Deleted menu successfully",
            result: deletedMenu
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete menu",
            error: error
        });
    }

};
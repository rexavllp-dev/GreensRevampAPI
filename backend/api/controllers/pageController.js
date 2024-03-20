import { createAPage, deleteAPage, getAPage, getsAllPages, updateAPage } from "../models/pageModel.js";



export const createPage = async (req, res) => {

    const pageData = req.body;

    try {

        const newPage = await createAPage(pageData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "New page created successfully",
            result: newPage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create page",
            error: error
        });
    }

};




export const updatePage = async (req, res) => {

    const pageId = req.params.pageId;
    const pageData = req.body;

    try {

        const updatedPage = await updateAPage(pageId, pageData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Page updated successfully",
            result: updatedPage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update page",
            error: error
        });
    }

};



export const getPage = async (req, res) => {

    const pageId = req.params.pageId;

    try {

        const page = await getAPage(pageId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Page fetched successfully",
            result: page
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch page",
            error: error
        });
    }

};


export const getAllPages = async (req, res) => {

    try {

        const pages = await getsAllPages();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Pages fetched successfully",
            result: pages
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch pages",
            error: error
        });
    }
};



export const deletePage = async (req, res) => {

    const pageId = req.params.pageId;

    try {

        const deletedPage = await deleteAPage(pageId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Deleted page successfully",
            result: deletedPage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete page",
            error: error
        });
    }

};
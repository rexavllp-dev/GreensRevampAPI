import { createAPageSeo, deleteAPageSeo, getAPageSeo, getsAllPageSeos, updateAPageSeo } from "../models/pageSeoModel.js";




export const createPageSeo = async (req, res) => {

    const pageSeoData = req.body;

    try {

        const newPageSeo = await createAPageSeo(pageSeoData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "New page seo created successfully",
            result: newPageSeo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create page seo",
            error: error
        });
    }

};




export const updatePageSeo = async (req, res) => {

    const pageSeoId = req.params.pageSeoId;
    const pageSeoData = req.body;

    try {

        const updatedPageSeo = await updateAPageSeo(pageSeoId, pageSeoData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Page seo updated successfully",
            result: updatedPageSeo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update page seo",
            error: error
        });
    }

};



export const getPageSeo = async (req, res) => {

    const pageSeoId = req.params.pageSeoId;

    try {

        const pageSeo = await getAPageSeo(pageSeoId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Page seo fetched successfully",
            result: pageSeo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch page seo",
            error: error
        });
    }

};


export const getAllPageSeos = async (req, res) => {

    try {

        const pageSeos = await getsAllPageSeos();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Page seos fetched successfully",
            result: pageSeos
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch page seos",
            error: error
        });
    }
};



export const deletePageSeo = async (req, res) => {

    const pageSeoId = req.params.pageSeoId;

    try {

        const deletedPageSeo = await deleteAPageSeo(pageSeoId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Deleted pageSeo successfully",
            result: deletedPageSeo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete pageSeo",
            error: error
        });
    }

};
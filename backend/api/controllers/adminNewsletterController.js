import { createANewsletter, getANewsletter, getsAllNewsletter, updateANewsletter } from "../models/adminNewsletterModel.js";



export const createNewsletter = async (req, res) => {

    const newsletterData = req.body;

    try {

        const newsletter = await createANewsletter(newsletterData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Newsletter created successfully",
            result: newsletter
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create newsletter",
            error: error
        });
    }
};



export const updateNewsletter = async (req, res) => {

    const newsletterId = req.params.newsletterId;
    const newsletterData = req.body;

    try {

        const newsletter = await updateANewsletter(newsletterId, newsletterData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Newsletter updated successfully",
            result: newsletter
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update newsletter",
            error: error
        });
    }
};



export const getNewsletter = async (req, res) => {

    const newsletterId = req.params.newsletterId;

    try {

        const newsletter = await getANewsletter(newsletterId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Newsletter fetched successfully",
            result: newsletter
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch newsletter",
            error: error
        });
    }

};



export const getAllNewsletters = async (req, res) => {

    try {

        const newsletters = await getsAllNewsletter();
        res.status(200).json({
            status: 200,
            success: true,
            message: "Newsletters fetched successfully",
            result: newsletters
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch newsletters",
            error: error
        });
    }
};
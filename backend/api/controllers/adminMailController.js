import { createAMail, getAMail, getsAllMail, updateAMail } from "../models/adminMailModel.js";



export const createMail = async (req, res) => {

    const mailData = req.body;

    try {

        const mail = await createAMail(mailData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Mail created successfully",
            result: mail
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create mail",
            error: error
        });
    }
};



export const updateMail = async (req, res) => {

    const mailId = req.params.mailId;
    const mailData = req.body;

    try {

        const mail = await updateAMail(mailId, mailData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Mail updated successfully",
            result: mail
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update mail",
            error: error
        });
    }
};



export const getMail = async (req, res) => {

    const mailId = req.params.mailId;

    try {

        const mail = await getAMail(mailId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched mail successfully",
            result: mail
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch mail",
            error: error
        });
    }
};



export const getAllMails = async (req, res) => {

    try {

        const mails = await getsAllMail();
        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched mails successfully",
            result: mails
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch mails",
            error: error
        });
    }
};
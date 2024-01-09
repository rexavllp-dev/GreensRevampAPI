
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();


export const sendEmail = async ({ email, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.FROM_GMAIL,
            to: email,
            subject: subject,
            html: html,

        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error
    }
};
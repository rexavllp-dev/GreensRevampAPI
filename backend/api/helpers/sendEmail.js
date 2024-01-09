
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();


export const sendEmail = async ({ email, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({

            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "6308c2d6ce2dce",
                pass: "********5a69"
            }


            // service: 'gmail',
            // auth: {
            //     user: process.env.USER_GMAIL,
            //     pass: process.env.APP_PASSWORD,
            // },
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

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();



export const sendEmail = async ({ email, subject, html, attachments }) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "athena.indiandns.net",
            port: 465,
            secure: true,
            auth: {
                user: "mymail@greens-intl.ae",
                pass: "8C2HwCOtsgz("
            }
        });

        const mailOptions = {
            from: 'mymail@greens-intl.ae',
            to: email,
            subject: subject,
            html: html,
            attachments: attachments,

        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error
    }
};
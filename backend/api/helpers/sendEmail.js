
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();



export const sendEmail = async ({ email, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'rexavtimetrack@outlook.com',
                pass: 'rexav2626',
            },
        });

        const mailOptions = {
            from: 'rexavtimetrack@outlook.com',
            to: email,
            subject: subject,
            html: html,

        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error
    }
};
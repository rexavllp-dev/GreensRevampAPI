
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();



export const sendEmail = async ({ email, subject, html }) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
        auth: {
          user: "rexavtimetrack@outlook.com", // generated ethereal user
          pass: "rexav2626", // generated ethereal password
        },
        tls: {
          ciphers:'SSLv3'
        }
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
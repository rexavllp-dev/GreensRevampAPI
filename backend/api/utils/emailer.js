import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
// import Greens_Logo from '../public/images/Logo.png';




dotenv.config();

// verify email
 export const sendVerificationEmail = async (usr_email, token, from) => {
  console.log(usr_email);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}&orgin=${from}`;
  const mailOptions = {
    from: process.env.FROM_GMAIL,
    to: usr_email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
};



// send reset password to email
export const sendPasswordResetEmail = async (usr_email, usr_firstname, token) => {
        
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  const resetPassLink = `http://localhost:3000/auth/reset?token=${token}`;
  const mailOptions = {
    from: process.env.FROM_GMAIL,
    to: usr_email,
    subject: 'Reset Password',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="../public/images/Logo.png" alt="Company Logo" style="max-width: 100%;">
        </div>
    
            <h2> Password Reset</h2>
    
            <p> Hello, <b> ${usr_firstname } </b></p>
    
            <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
    
            <p> Click the link below to reset your password: </p>
    
            <p>
                <a href= ${resetPassLink} target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </p>
  
            <p>This link will expire in  <b>10 minutes </b> for security reasons.</p>
    
            <p>If you didn't request a password reset, please disregard this email.</p>
    
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,
  };
  await transporter.sendMail(mailOptions);
}


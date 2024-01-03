import nodemailer from 'nodemailer';
import dotenv from 'dotenv'


dotenv.config();



// verify email
export const sendVerificationEmail = async (usr_email, usr_firstname, token, from) => {
  console.log(usr_email);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const verificationLink = process.env.BASE_URL`/auth/verify-email?token=${token}&orgin=${from}`;
  const mailOptions = {
    from: process.env.FROM_GMAIL,
    to: usr_email,
    subject: 'Email Verification',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2>Email Verification</h2>
    
            <p> Hello, <b> ${ usr_firstname } </b></p>
    
            <p>Thank you for signing up! Please click the link below to verify your email:</p>
    
            <p>
                <a href=${verificationLink} target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            </p>
    
            <p>If you didn't sign up for our service, you can ignore this email.</p>
    
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,
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
  const resetPassLink = process.env.BASE_URL`/auth/reset?token=${token}`;
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
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2> Password Reset</h2>
    
            <p> Hello, <b> ${ usr_firstname } </b></p>
    
            <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
    
            <p> Click the link below to reset your password: </p>
    
            <p>
                <a href= ${resetPassLink} target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 6px;">Reset Password</a>
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


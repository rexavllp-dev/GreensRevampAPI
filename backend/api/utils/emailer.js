import dotenv from 'dotenv'
import { sendEmail } from '../helpers/sendEmail.js';


dotenv.config();


// verify email
export const sendVerificationEmail = async (usr_email, usr_firstname, token, from) => {
  const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}&orgin=${from}`;
  const emailData = {
    email: usr_email,
    subject: `Email verification`,
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
  
          <p> Hello, <b> ${usr_firstname} </b></p>
  
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

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }

};



// send reset password to email
export const sendPasswordResetEmail = async (usr_email, usr_firstname, token) => {
  console.log(usr_email);

  const resetPassLink = `${process.env.BASE_URL}/auth/reset?token=${token}`;
  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
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
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
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

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }


}



// send email for company verification 
export const sendVerificationApproved = async (usr_email, usr_firstname) => {

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'Company Verification Approved',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Company verification </title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2>Company verification </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>You are blocked temporary due to repeated incorrect attempts.Please Contact admin for assistance.</p>
    
            <p> Click the link below to reset your password: </p>
    
            <a href="https://react.greens-intl.ae/auth/login/"> Login with another account</a>
  
          
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,
    
    
  //   `<p> Dear ${usr_firstname} </p>
  //   <p>Thank you for signing up!.Your company is verified successfully, Now you can login </p>
  //   <a href="https://react.greens-intl.ae/auth/login/">Login Account</a>
  //   <p>Thank you</p>
  // `,
  };

  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};


// send email for company verification 
export const sendVerificationRejected = async (usr_email, usr_firstname) => {

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'Company Verification Successfully',
    html: `<p> Dear ${usr_firstname} </p>
    <p>Thank you for signing up!.Your company has been rejected,reason...</p>
    <a href="https://react.greens-intl.ae/auth/register/">Try again</a>
    <p>Thank you</p>
  `,

  };
  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};


// send email for company verification 
export const sendBlockVerification = async (usr_email, usr_firstname) => {

  const emailData = {
    from: process.env.FROM_GMAIL,
    email: usr_email,
    subject: 'User Blocked ',
    html:`<!DOCTYPE html>
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
    
            <h2>User Blocked </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>You are blocked temporary due to repeated incorrect attempts.Please Contact admin for assistance.</p>
    
            <p> Click the link below to reset your password: </p>
    
            <a href="https://react.greens-intl.ae/auth/login/"> Login with another account</a>
  
          
            <p>Best regards,<br> <b>Greens International </b> </p>
    
        </div>
    </body>
    </html>`,
    
    
  //   `<p> Dear ${usr_firstname} </p>
  //   <p>You are blocked temporary due to repeated incorrect attempts.Please Contact admin for assistance.</p>
  //   <a href="https://react.greens-intl.ae/auth/login/">Try again</a>
  //   <p>Thank you</p>
  // `

  };
  try {
    await sendEmail(emailData);
  } catch (error) {
    throw error
  }
};


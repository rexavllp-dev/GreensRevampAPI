import dotenv from 'dotenv'
import { sendEmail } from '../helpers/sendEmail.js';
import { emailTemplateData } from '../helpers/emailTemplate.js';


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


// user registration successful
export const sendUserRegistrationEmail = async (usr_email, usr_firstname) => {

    const emailData = {
        email: usr_email,
        subject: `Registration Complete`,
        html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Complete</title>
  </head>
  <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Logo -->
      <div style="text-align: center;">
          <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
      </div>
  
          <h2>Registration Complete</h2>
  
          <p> Hello, <b> ${usr_firstname} </b></p>
  
          <p>Congratulations! You have successfully completed your registration.</p>
  
          <p>
          <a href="https://react.greens-intl.ae/auth/login/">Click here to Login </a> 
          </p>

  
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
  
            <p>This link will expire in  <b> 24 Hours  </b> for security reasons.</p>
    
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
    
            <p>Thank you for signing up!.Your company is verified successfully, Now you can login </p>
    
            <a href="https://react.greens-intl.ae/auth/login/">Click here to Login </a>
  
          
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
    
            <h2>User Blocked </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>You are blocked temporary due to repeated incorrect attempts.Please Contact admin for assistance.</p>
    
        
    
            <a href="https://react.greens-intl.ae/auth/login/"> Login</a>
  
          
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

// bulk orders

export const sendVerificationBulkApproved = async (usr_email, usr_firstname, productName, quantity, lowestBulkDiscount) => {

    const emailData = {
        from: process.env.FROM_GMAIL,
        email: usr_email,
        subject: 'Your Bulk Order Request Approved',
        html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulk order verification </title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2> Your Bulk order request approved </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>Your bulk order has been approved successfully for product <b>${productName}</b> with quantity <b> ${quantity} </b> with per product price of <b> ${lowestBulkDiscount} </b> </p>

            <p> <b>website link</b> : <a href="https://react.greens-intl.ae/">greensintl.com</a></p>
    
  
          
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



export const sendVerificationBulkRejected = async (usr_email, usr_firstname, productName, quantity) => {

    const emailData = {
        from: process.env.FROM_GMAIL,
        email: usr_email,
        subject: 'Your Bulk Order Request Rejected',
        html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulk order verification </title>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
        </div>
    
            <h2> Your bulk order rejected  </h2>
    
            <p> Hello, <b> ${usr_firstname} </b></p>
    
            <p>Your bulk order has been rejected for product <b>${productName}</b> with quantity <b> ${quantity} </b> </p>
    
  
          
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




export const sendOrderInvoices = async (orderData, pdfData) => {

    console.log(pdfData);

    const emailData = {
        from: process.env.FROM_GMAIL,
        email: orderData[0].ord_customer_email,
        subject: 'Your Order Invoice',
        html: emailTemplateData(orderData),

        attachments: [
            {
                filename: 'invoice.pdf',
                content: Buffer.from(pdfData.pdfData, 'base64'),
                encoding: 'base64' // Ensure the correct encoding for the attachment content
            }
        ]

    };

    try {
        await sendEmail(emailData);
    } catch (error) {
        throw error
    }
};



// update user account to company account 

export const UpdateUserAccountToCompany = async (usr_email, usr_firstname) => {

    const emailData = {
        email: usr_email,
        subject: `Registration Complete`,
        html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Complete</title>
  </head>
  <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Logo -->
      <div style="text-align: center;">
          <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
      </div>
  
          <h2>Registration Complete</h2>
  
          <p> Hello <b> ${usr_firstname} </b>,</p>
  
          <p>Congratulations! You have successfully completed your company registration. Admin will verify your account and switch your account to business account.</p>

  
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


// send a email when user change password 

export const userPasswordChanged = async (usr_email, usr_firstname) => {

    const emailData = {
        email: usr_email,
        subject: `password changed`,
        html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your password has been changed </title>
  </head>
  <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Logo -->
      <div style="text-align: center;">
          <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
      </div>
  
          <h2>Password changed</h2>
  
          <p> Hello <b> ${usr_firstname} </b></p>
  
          <p>Your password has been changed.</p>

  
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





export const sendEmailForBackInStock = async (usr_email, usr_firstname, prd_name) => {
    console.log(usr_email, usr_firstname, prd_name);

    const emailData = {
        email: usr_email,
        subject: `Product Back in Stock: ${prd_name}`,
        html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title> Product ${prd_name} back in stock </title>
  </head>
  <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">

      <!-- Logo -->
      <div style="text-align: center;">
          <img src="https://greensintl.com/storage/media/oWVP03O95iplNIxRs1bWbeosliSihixTXN0tg8dT.png" alt="Company Logo" style="max-width: 50%;">
      </div>
  
          <h2>Product back in stock</h2>
  
          <p> Hello <b> ${usr_firstname} </b></p>
  
          <p> Your product <b> ${prd_name} </b>  is now back in stock.</p>

  
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




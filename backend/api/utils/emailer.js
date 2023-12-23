import nodemailer from 'nodemailer';


// verify email
 export const sendVerificationEmail = async (usr_email, token) => {
  console.log(usr_email);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.FROM_GMAIL,
    to: usr_email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
};



// send reset password to email
export const sendPasswordResetEmail = async (usr_email, token) => {
        
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
    text: `Click the following link to Reset your password: ${resetPassLink}`,
  };
  await transporter.sendMail(mailOptions);
}


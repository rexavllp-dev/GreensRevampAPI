import nodemailer from 'nodemailer';



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
}


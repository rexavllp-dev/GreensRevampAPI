import nodemailer from 'nodemailer';



 export const sendVerificationEmail = async (usr_email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.FROM_GMAIL,
    to: process.env.TO_GMAIL,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
}


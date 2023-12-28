import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { findByresetToken, updatePassword, updateResetToken, userforgotPassword } from '../models/userModel.js';
import bcrypt from "bcrypt";

// forgot password

    // Generate a unique reset token

    const generateToken = () => crypto.randomBytes(20).toString('hex');

    const sendPasswordResetEmail = async (usr_email, token) => {
        
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.APP_PASSWORD,
              },
            });
            const resetPassLink = `http://localhost:3000/verify-email?token=${token}`;
            const mailOptions = {
              from: process.env.FROM_GMAIL,
              to: usr_email,
              subject: 'Reset Password',
              text: `Click the following link to Reset your password: ${resetPassLink}`,
            };
            await transporter.sendMail(mailOptions);
          }
       

         export const forgotPassword = async (req, res) => {
            const {usr_email} = req.body;


            try {
                const user = await userforgotPassword(usr_email);

                if(!user) {
                    return res.status(404).json({
                        status: 404,
                        success: false,
                        message: "User not found"
                    });
                }

                const token = generateToken();
                const expiresAt = new Date(Date.now() + 300000)

                await updateResetToken(usr_email,token,expiresAt);
                await sendPasswordResetEmail(usr_email,token);

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Password reset link send to your email successfully"
                });
                
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal server error"
                });
            }
        
          }


        export const resetPssword = async  (req,res) => {

            const {token,usr_password} = req.body;
                
            try {

                const user = await findByresetToken(token);
                
                if(!user) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: "Invalid or expired token"
                    });
                }

                const hashedPassword = await bcrypt.hash(usr_password, 12);

                await updatePassword(user.id, hashedPassword);

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "password reset successfully"
                });
            }catch(error) {
                console.error(error);
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error"
                });
            }
          }






    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // const generateResetToken = async (resetUSerPassword, usr_email) => {
    //     const token = generateToken();
    //     const expiresAt = new Date(Date.now()+300000); // Token expires in 5 minitues

    //     const data = {
    //         resetToken: token,
    //         reset_token_expires_at: expiresAt,

    //     }
    // }
    

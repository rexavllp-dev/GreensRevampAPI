import crypto from 'crypto';
import bcrypt from "bcrypt";
import { findByResetToken, updatePassword, updateResetToken, userForgotPassword } from '../models/userModel.js';
import { sendPasswordResetEmail } from '../utils/emailer.js';




// Generate a unique reset token
const generateToken = () => crypto.randomBytes(20).toString('hex');



// forgot password
export const forgotPassword = async (req, res) => {
    const { usr_email } = req.body;


    try {
        const user = await userForgotPassword(usr_email);

        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        const token = generateToken();
        const expiresAt = new Date(Date.now() + 300000)

        await updateResetToken(usr_email, token, expiresAt);
        await sendPasswordResetEmail(usr_email, token);

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

};



// reset password 

export const resetPassword = async  (req,res) => {

    const { token, usr_password } = req.body;
        
    try {

        const user = await findByResetToken(token);
        
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
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    }
  };






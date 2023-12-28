import { blockUser, createUser, getUserByEmail, getUserByPhoneNumber, refreshTokenModel, resendUpdateLoginOtp,  saveOtp, unblockUser, updateOtp } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from "../middleware/token.js";
import sendVerificationCode from "../utils/mobileOtp.js";






// creating a user functions 
export const registerUser = async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.status(200).json({
            status: 200,
            success: true,
            message: "User registration  successfully!",
            result: newUser,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create user! Please try again later."

        });
    }
};




//login user

export const login = async (req, res) => {
    const { usr_email, usr_password } = req.body;

    try {
        //check if user exists 
        const existingUser = await getUserByEmail(usr_email);

        if (!existingUser) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Invalid email or password!"
            });

        }

        // Check if password is correct

        const isPasswordCorrect = await bcrypt.compare(usr_password, existingUser?.usr_password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Invalid email or password!"
            });
        }

        //create token

        const accessToken = generateAccessToken(existingUser)

        const refreshToken = generateRefreshToken(existingUser)
 


        // save refresh token to the database
        const saveToken = await refreshTokenModel.saveRefreshToken(refreshToken,existingUser.id)




        //send token to client 
        res.status(200).json({
            status: 200,
            success: true,
            message: "Logged in successfully!",

            result: {
                accessToken,
                refreshToken,
                user: {
                    id: existingUser.id,
                    usr_email: existingUser.usr_email,
                    usr_firstname: existingUser.usr_firstname,
                    usr_lastname: existingUser.usr_lastname,

                }
            }
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({

            status: 500,
            success: false,
            error: error,
            message: "Failed logging in! Please try again later."
        });
    }
}

// Refresh Token

export const refreshAccessToken = async (req, res) => {

    const { refresh_token } = req.body;


    try {

        
        if (!refresh_token) {
            return res.status(401).json({ message: "Refresh token is required" })
        }

        // verify the refresh token

        const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH);
        



        // check if refreshToken exist in database

        const storedToken = await refreshTokenModel.findRefreshToken(decoded.userId, refresh_token);
        
        if (!storedToken) {
              return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // If the refresh token is valid, generate a new access token

        const user = { id: decoded.userId };
        const newAccessToken = generateAccessToken(user);

        // Update the refresh token in the database

        const newRefreshToken = generateRefreshToken(user);
        await refreshTokenModel.updateResetToken(decoded.userId, newRefreshToken);

        return res.json({ accessToken: newAccessToken, refresh_token: newAccessToken })
    } catch (error) {
        console.log(error);

        return res.status(401).json({ message: 'Invalid refresh token' });
    }

}


// login user with otp

export const loginWithOtp = async(req, res) => {
    const { usr_mobile_number } = req.body;

    try {
        //check user exist 

        const existingUser = await getUserByPhoneNumber(usr_mobile_number)

        

        if(!existingUser) {

            return res.status(401).json({
                status: 401,
                success: false,
                message: "Mobile number not found , please register your mobile number!"
            }); 
        }

        // generate otp
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        await saveOtp(existingUser.id, otpCode, otpExpiry)

      const otpSent = await sendVerificationCode(existingUser.usr_mobile_number, otpCode)

      if (otpSent) {
        return res.status(200).json({ message: 'OTP sent successfully' });
      } else {
        return res.status(500).json({ message: 'Failed to send OTP' });
      }

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error'})
    }

}

// verify login otp


export const verifyLoginOtp = async (req, res) => {
    const { usr_mobile_number, otpCode } = req.body;
    // Check if OTP is valid and not expired
    const user = await getUserByPhoneNumber(usr_mobile_number);

    if (!user || user.login_otp !== otpCode || new Date() > new Date(user.login_otp_expiry)) {
        console.log(user?.login_otp);
        console.log(user?.login_otp_expiry);
        return res.status(401).json({ error: 'Invalid OTP or OTP expired' });
    }

    if (user && user.login_otp === otpCode) {
        // Clear OTP after successful verification
        await updateOtp(user.id);
        return res.status(200).json({ message: 'otp verified successfully' });
    } else {
        return res.status(500).json({ message: 'internal server error please try again' });
    }

}

// resent login otp

export const resendLoginOtp = async (req, res) => {
    const { usr_mobile_number } = req.body;
    try {
        const user = await getUserByPhoneNumber(usr_mobile_number);
        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        await resendUpdateLoginOtp(user.id, otpCode, otpExpiry)


        await sendVerificationCode(usr_mobile_number,otpCode);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Otp send successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to send otp"
        });
    }
};



// block user by admim

export const blockUserbyadmin = async( req, res) => {
    const {userId} = req.params;


    try {
        await blockUser(userId);
        res.status(200).json({ message: 'User blocked successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

}


// unblock by user by admin

export const unblockUserbyadmin = async(req, res) => {
    const {userId} = req.params;

    try {
        await unblockUser(userId);
        res.status(200).json({ message: 'User unblocked successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

}
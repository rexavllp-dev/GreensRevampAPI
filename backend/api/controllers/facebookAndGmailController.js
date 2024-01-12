import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import dotenv from 'dotenv';

dotenv.config();


export const googleAuth = async (req, res) => {
    try {

        // Check if the user has a company and is verified
        if (!req.user.company || !req.user.isVerified) {
  
            return res.status(403).json({
                status: 403,
                success: false,
                message: "User is not allowed to log in with Google due to missing company  unverified status",
            });
        }
     
        const accessToken = generateAccessToken(req.user)
        const refreshToken = generateRefreshToken(req.user)

        console.log(req.user)

        // res.status(201).json({
        //   status:201,
        //   success:true,
        //   message:"success",
        //   result:{ accessToken, refreshToken }
        // });
        res.redirect(`${process.env.BASE_URL}/auth/success?access_token=${accessToken}&refresh_token=${refreshToken}&usr_firstname=${req.user.usr_firstname}&usr_lastname=${req.user.usr_lastname}&usr_email=${req.user.usr_email}`);
    } catch (error) {
        console.log(error);
    }
};


export const facebookAuth = async (req, res) => {
    try {

        const accessToken = generateAccessToken(req.user)
        const refreshToken = generateRefreshToken(req.user)


        res.redirect(`${process.env.BASE_URL}/auth/success?access_token=${accessToken}&refresh_token=${refreshToken}&usr_firstname=${req.user.usr_firstname}&usr_lastname=${req.user.usr_lastname}&usr_email=${req.user.usr_email}`);
        // res.status(201).json({
        //   status:201,
        //   success:true,
        //   message:"success",
        //   result:{ accessToken, refreshToken }
        // });
    } catch (error) {
        console.log(error);
    }
};
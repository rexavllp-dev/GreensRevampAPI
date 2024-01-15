import { iSCompanyStatusVerified } from "../models/companyModel.js";
import { getUserById } from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import dotenv from 'dotenv';

dotenv.config();


export const googleAuth = async (req, res) => {
    try {

        const userId = req.user.id;

        const existingUser = await getUserById(userId);

        const userCompany = existingUser.usr_company;

        // Check if the user's company is verified
        const companyVerificationStatus = await iSCompanyStatusVerified(userCompany);

        if (!companyVerificationStatus || !companyVerificationStatus.verification_status) {
            if (existingUser.usr_approval_id === 1) {
                const pendingMessage = "Please wait for company verification. Your account is pending for approval.";
                res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(pendingMessage)}`);
                encodeURIComponent(pendingMessage);


            } else if (existingUser.usr_approval_id === 3) {

                const rejectMessage = "Your company is rejected. Contact admin for further assistance.";
                res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(rejectMessage)}`);
                encodeURIComponent(rejectMessage);
            }
        }


        // Check if the user is blocked by the admin
        if (!existingUser.is_status) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "User is suspend .Please contact admin for assistance."
            });
        }


        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);

        console.log(existingUser)

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


        const userId = req.user.id;

        const existingUser = await getUserById(userId);

        const userCompany = existingUser.usr_company;

        // Check if the user's company is verified
        const companyVerificationStatus = await iSCompanyStatusVerified(userCompany);

        if (!companyVerificationStatus || !companyVerificationStatus.verification_status) {
            if (existingUser.usr_approval_id === 1) {
                const pendingMessage = "Please wait for company verification. Your account is pending for approval.";
                res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(pendingMessage)}`);
                encodeURIComponent(pendingMessage);


            } else if (existingUser.usr_approval_id === 3) {

                const rejectMessage = "Your company is rejected. Contact admin for further assistance.";
                res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(rejectMessage)}`);
                encodeURIComponent(rejectMessage);
            }
        }

        // Check if the user is blocked by the admin
        if (!existingUser.is_status) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "User is suspend .Please contact admin for assistance."
            });
        }


        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);


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
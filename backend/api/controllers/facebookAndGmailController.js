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
                return res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(pendingMessage)}`);


            } else if (existingUser.usr_approval_id === 3) {

                const rejectMessage = "Your company is rejected. Contact admin for further assistance.";
                return res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(rejectMessage)}`);
            }
        }


        // Check if the user is blocked by the admin
        if (!existingUser.is_status) {

            const pendingMessage = "User is suspend .Please contact admin for assistance.";
            return res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(pendingMessage)}`);
        }


        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);


        // res.status(201).json({
        //   status:201,
        //   success:true,
        //   message:"success",
        //   result:{ accessToken, refreshToken }
        // });
        return res.redirect(`${process.env.BASE_URL}/auth/success?access_token=${accessToken}&refresh_token=${refreshToken}&usr_firstname=${req.user.usr_firstname}&usr_lastname=${req.user.usr_lastname}&usr_email=${req.user.usr_email}&is_role=${req.user.is_role}`);
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
                return res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(pendingMessage)}`);


            } else if (existingUser.usr_approval_id === 3) {

                const rejectMessage = "Your company is rejected. Contact admin for further assistance.";
                return res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(rejectMessage)}`);
            }
        }

        // Check if the user is blocked by the admin
        if (!existingUser.is_status) {
            const pendingMessage = "User is suspend .Please contact admin for assistance.";
            return res.redirect(`${process.env.BASE_URL}/auth/fail?message=${encodeURIComponent(pendingMessage)}`);
        }


        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);


        return res.redirect(`${process.env.BASE_URL}/auth/success?access_token=${accessToken}&refresh_token=${refreshToken}&usr_firstname=${req.user.usr_firstname}&usr_lastname=${req.user.usr_lastname}&usr_email=${req.user.usr_email}&is_role=${req.user.is_role}`);
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
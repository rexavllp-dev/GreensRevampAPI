import { checkCompanyExist, createCompany } from "../models/companyModel.js";
import Joi from 'joi';
import { joiOptions } from '../helpers/joiOptions.js';
import getErrorsInArray from '../helpers/getErrors.js';
import { checkUserExist, createUser, deleteAUser, getUserByEmail, getUserById, getUserByPhoneNumber, updateOtp, updateRegisterOtp, updateUserVerificationStatus } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "../utils/emailer.js";
import sendVerificationCode from "../utils/mobileOtp.js";
import jwt from 'jsonwebtoken';
import aws from 'aws-sdk';
import Jimp from "jimp";

const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig)

// creating a company functions 
export const registerCompany = async (req, res) => {



    let {
        usr_firstname,
        usr_lastname,
        usr_mobile_number,
        usr_mobile_country_code,
        usr_email,
        usr_password,
        usr_designation,
        usr_company,
        usr_tos_accepted,
        usr_newsletter_accepted,
        email_verified,


        company_name,
        company_landline,
        company_landline_country_code,
        company_trn_number,
        company_trade_license_expiry,

    } = req.body;

    const files = req.files;

    try {





        const existingCompany = await checkCompanyExist(company_trn_number);
        if (existingCompany.length) {
            return res.status(409).json({
                status: 409,
                success: false,
                message: "Company already exist",

            });
        }

        const existingUser = await checkUserExist(usr_mobile_number, usr_email);
        if (existingUser.length) {
            return res.status(409).json({
                status: 409,
                success: false,
                message: "User already exist",
            });
        }

        if (req.file) {
            const resizedUrl = await resizeAndUpload(req.file);
            company_trade_license = resizedUrl;
        }




        // Register company validation 
        const schema = Joi.object({
            usr_firstname: Joi.string().required().label("First Name"),
            usr_lastname: Joi.string().required().label("Last Name"),
            usr_mobile_number: Joi.string().required().label("Mobile Number"),
            usr_mobile_country_code: Joi.number().required().label("Country Code"),
            usr_email: Joi.string().required().label("Email"),
            usr_password: Joi.string().required().label("Password"),
            usr_designation: Joi.string().label("Designation"),
            usr_tos_accepted: Joi.boolean().required().label("Term Of Use"),
            usr_newsletter_accepted: Joi.boolean().required().label("Newsletter"),
            email_verified: Joi.boolean(),

            company_name: Joi.string().required().label("Company Name"),
            company_landline: Joi.string().required().label("Landline"),
            company_landline_country_code: Joi.number().required().label("Country Code"),
            company_vat_certificate: Joi.string().label("Vat Certificate"),
            company_trn_number: Joi.number().required().label("Trn Number"),
            company_trade_license: Joi.string().label("Trade License"),
            company_trade_license_expiry: Joi.date().required().label("Trade License Expiry Date"),

        });

        // Register company validation data

        const validate_data = {
            usr_firstname,
            usr_lastname,
            usr_mobile_number,
            usr_mobile_country_code,
            usr_email,
            usr_password,
            usr_designation,
            usr_tos_accepted,
            usr_newsletter_accepted,
            email_verified,

            company_name,
            company_landline,
            company_landline_country_code,
            company_trn_number,
            company_trade_license_expiry,

        };



        const { error } = schema.validate(validate_data, joiOptions);
        if (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Validation Error",
                error: getErrorsInArray(error?.details),
            });
        };


        if (!req.files) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "No image provided",
            });
        }

        let company_vat_certificate;
        let  company_trade_license;

        for (const field in files) {
            const file = files[field];

            console.log(file);
            // upload resized to s3 
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/${file.name}`,
                Body: file.data,
                ContentType: file.mimetype,
            };

            const s3Data = await s3.upload(uploadParams).promise();
            if(field === "company_vat_certificate" ) {
                company_vat_certificate = s3Data.Location
            } else {
                company_trade_license = s3Data.Location
            }
        };


        const newCompany = await createCompany({
            company_name,
            company_landline,
            company_landline_country_code,
            company_vat_certificate,
            company_trn_number,
            company_trade_license,
            company_trade_license_expiry,
        });


        // password hash using bcrypt 
        const hashedPassword = await bcrypt.hash(usr_password, 12);

        const newUser = await createUser({
            usr_firstname,
            usr_lastname,
            usr_mobile_number,
            usr_mobile_country_code,
            usr_email,
            usr_password: hashedPassword,
            usr_designation,
            usr_tos_accepted,
            usr_newsletter_accepted,
            email_verified: false,
            usr_company: newCompany[0].id,
        });

        const userId = newUser[0]?.id;
        // jwt user token 
        const token = jwt.sign({ userId, usr_email, usr_firstname, usr_company }, process.env.EMAIL_SECRET, { expiresIn: "600s" });

        // Send email verification link
        await sendVerificationEmail(usr_email, token, 'company');




        res.status(201).json({
            status: 201,
            success: true,
            message: "Company registration successful. Check your email for verification ",
            result: {
                company: newCompany,
                userToken: {
                    token,
                    user: {
                        userId,
                        usr_email,
                        usr_firstname,
                        usr_lastname,
                        usr_company,
                    }
                }
            }



        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create company! Please try again later."

        });
    }
};

// #region email verification 

export const verifyEmail = async (req, res) => {

    const token = req.query.token;
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.DECODED);
        const userId = decoded.userId;
        // console.log(decoded);

        // Update user verification status
        const email_verified = await updateUserVerificationStatus(userId, true);

        // Set OTP expiry time (e.g., 5 minutes from now)

        // Generate a random 6-digit verification code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        if (email_verified) {
            const user = await updateRegisterOtp(userId, otp, otpExpiry)
            console.log(user);
            // Send OTP via SMS
            await sendVerificationCode(user.usr_mobile_number, user.otp, user.otp_expiry);



            res.json({ message: 'Email verification successful, Check your mobile for verification' });
        } else {
            res.status(400).json({ message: 'User not found or already verified.' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};
// #endregion



// region resend email 

export const resendEmail = async (req, res) => {
    const { usr_email } = req.body;
    try {
        const user = await getUserByEmail(usr_email);
        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        // jwt user token 
        const token = jwt.sign({
            userId: user.id,
            usr_email,
            usr_firstname: user.usr_firstname,
            usr_company: user.usr_company,
        },
            process.env.EMAIL_SECRET,
            { expiresIn: "15d" });

        // Send email verification link
        await sendVerificationEmail(usr_email, token);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Email verification link send successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to send email"
        });
    }
};

// #endregion


// region resend resendOtp 

export const resendOtp = async (req, res) => {
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
        await sendVerificationCode(usr_mobile_number);


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

// #endregion

export const verifyOtp = async (req, res) => {
    const { usr_mobile_number, otpCode } = req.body;

    // Check if OTP is valid and not expired
    const user = await getUserByPhoneNumber(usr_mobile_number);
    console.log(user);

    if (!user || user.otp !== otpCode || new Date() > new Date(user.otp_expiry)) {
        console.log(user?.otp);
        console.log(user?.otp_expiry);
        return res.status(401).json({ error: 'Invalid OTP or OTP expired' });
    }

    if (user && user.otp === otpCode) {
        // Clear OTP after successful verification
        await updateOtp(user.id);
    }

    // Perform additional user registration steps if needed

    res.status(200).json({ message: 'OTP verified successfully' });
};



// Get a single user
export const getSingleUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);

        if (!user) {

            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: "User successfully found",
            result: user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get user! Please try again later."

        });
    }
};




// delete a user
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deleteSingleUser = await deleteAUser(userId);
        return res.status(200).json({ success: true, message: 'User deleted successfully', result: deleteSingleUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

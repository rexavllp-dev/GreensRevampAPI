import { checkCompanyExist, createCompany } from "../models/companyModel.js";
import Joi from 'joi';
import JoiDate from '@joi/date';
import { joiOptions } from '../helpers/joiOptions.js';
import getErrorsInArray from '../helpers/getErrors.js';
import { checkUserExist, createUser, deleteAUser, getCountryDialCode, getUserByEmail, getUserById, getUserByPhoneNumber, updateOtp, updateRegisterOtp, updateUserVerificationStatus } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "../utils/emailer.js";
import sendVerificationCode from "../utils/mobileOtp.js";
import jwt from 'jsonwebtoken';
import aws from 'aws-sdk';
import sharp from "sharp";
import maintenanceModeMessage from 'aws-sdk/lib/maintenance_mode_message.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

// Suppress maintenance mode warning
maintenanceModeMessage.suppress = true;

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
        company_trade_license,
        // company_trade_license_expiry

    } = req.body;

    let company_trade_license_expiry = dayjs.utc(req.body.company_trade_license_expiry).utc(true).format();

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


        // Function to check if the file size is under 5MB
        // const isFileSizeValid = (file) => {
        //     const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        //     return file.size <= maxSize;
        // };



        if (req.file) {
            const resizedUrl = await resizeAndUpload(req.file);
            company_trade_license = resizedUrl;
        }



        // const JoiExtended = Joi.extend(JoiDate);
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

            // company field

            company_name: Joi.string().required().label("Company Name"),

            company_landline: Joi.string().allow('').label("Landline"),
            company_landline_country_code: Joi.number().allow('').label("Country Code"),

            company_vat_certificate: Joi.string().label("Vat Certificate"),
            company_trn_number: Joi.number().required().label("Trn Number"),
            company_trade_license: Joi.string().label("Trade License"),
            // company_trade_license_expiry: JoiExtended.date().raw().format("DD/MM/YYYY").required().label("Trade License Expiry Date"),

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
            // company_trade_license_expiry,

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

        // checking if there are files
        if (!req.files) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "No image provided",
            });
        }

        let company_vat_certificate;
        let company_trade_license;

        for (const field in files) {
            const file = files[field];


            // Check if the file size is under 5MB
            // if (!isFileSizeValid(file)) {
            //     return res.status(400).json({
            //         status: 400,
            //         success: false,
            //         message: "Image size should be under 5MB.",
            //     });
            // }


            // Check if the file is a PDF or JPEG before processing
            if (file.mimetype === 'image/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                // Resize only if it's a PDF, JPEG, PNG 
                const resizedBuffer = await sharp(file.data)
                    .resize({ width: 300, height: 300 }) // Adjust the dimensions as needed
                    .toBuffer();

                // Upload resized image to S3
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `images/${file.name}`,
                    Body: resizedBuffer, // Use the resized buffer
                    ContentType: file.mimetype,
                };

                const s3Data = await s3.upload(uploadParams).promise();

                if (field === "company_vat_certificate") {
                    company_vat_certificate = s3Data.Location;
                } else {
                    company_trade_license = s3Data.Location;
                }
            } else {
                // If it's not a PDF or JPEG, upload the original file without resizing
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `images/${file.name}`,
                    Body: file.data,
                    ContentType: file.mimetype,
                };

                const s3Data = await s3.upload(uploadParams).promise();

                if (field === "company_vat_certificate") {
                    company_vat_certificate = s3Data.Location;
                } else {
                    company_trade_license = s3Data.Location;
                }
            }
        }


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
        const registrationMethod = "manual registration";

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
            is_status: false,
            registration_method: registrationMethod,
            usr_approval_id: 1,
        });

        const userId = newUser[0]?.id;
        // jwt user token 
        const token = jwt.sign({ userId, usr_email, usr_firstname, usr_company }, process.env.EMAIL_SECRET, { expiresIn: "24h" });

        // Send email verification link
        await sendVerificationEmail(usr_email, usr_firstname, token, 'company');



        console.log(newUser);
        res.status(201).json({
            status: 201,
            success: true,
            message: "Company registration successful. Check your email for verification ",
            result: {
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
            const user = await updateRegisterOtp(userId, otp, otpExpiry);
            const country = await getCountryDialCode(userId)
            const countryDialCode = country?.country_dial_code;
            console.log(user);
            // Send OTP via SMS
            await sendVerificationCode(user.usr_mobile_number, user.otp, countryDialCode, user.otp_expiry);



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
        await sendVerificationEmail(usr_email, user.usr_firstname, token);
        res.status(201).json({
            status: 201,
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
    const { token } = req.params;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    try {
        const user = await validateAuth(token);
        console.log(user);

        const userInfo = await getUserById(user.userId);

        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        await updateRegisterOtp(userInfo.id, otp, otpExpiry);
        const country = await getCountryDialCode(userInfo.id);
        const countryDialCode = country?.country_dial_code;

        await sendVerificationCode(userInfo.usr_mobile_number, otp, countryDialCode, otpExpiry);


        res.status(201).json({
            status: 201,
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

    res.status(201).json({ message: 'OTP verified successfully' });
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
        res.status(201).json({
            status: 201,
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
        return res.status(201).json({ success: true, message: 'User deleted successfully', result: deleteSingleUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

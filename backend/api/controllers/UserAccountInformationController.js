import { checkCompanyExist } from "../models/companyModel.js";
import { createCompany, getCurrentUserCompanyTrn, updateCompany, updateCompanyUser, updateUserAccountInformation } from "../models/userAccountInformationModel.js";
import { checkUserExist, getUserById } from "../models/userModel.js";
import bcrypt from "bcrypt";
import Joi from 'joi';
import { joiOptions } from '../helpers/joiOptions.js';
import getErrorsInArray from '../helpers/getErrors.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
import maintenanceModeMessage from 'aws-sdk/lib/maintenance_mode_message.js';
import aws from 'aws-sdk';
import sharp from "sharp";
import { UpdateUserAccountToCompany } from "../utils/emailer.js";

// Suppress maintenance mode warning
maintenanceModeMessage.suppress = true;

const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig)

// update user account information
export const updateUserAccountInformations = async (req, res) => {

    try {
        const userId = req.user?.userId;
        const newData = req.body;

        const existingUser = await getUserById(userId);
        if (!existingUser) {

            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        };

        const updatedUser = await updateUserAccountInformation(userId, newData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "User updated successfully",
            result: updatedUser,
        })

    } catch (error) {
        console.log(error);

        res.status(400).json({
            status: 400,
            success: false,
            message: "failed to update the user",
        })
    }
}


// user change password

export const ChangeUserPassword = async (req, res) => {

    const userId = req.user.userId;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        const existingUser = await getUserById(userId);
        if (!existingUser) {

            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"

            })

        } else {

            if (!(await bcrypt.compare(oldPassword, existingUser.usr_password))) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Incorrect old password"
                });
            }


            if (newPassword === oldPassword) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "New password cannot be the same as old password"
                })
            }

            if (newPassword !== confirmPassword) {

                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Confirm Password does not match"
                })
            }


            const hashedPassword = await bcrypt.hash(newPassword, 12);

            const updatedUser = await updateUserAccountInformation(userId, { usr_password: hashedPassword });

            res.status(200).json({
                status: 200,
                success: true,
                message: "Password changed successfully",
                result: updatedUser,
            })

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 400,
            success: false,
            message: "failed to change the password",

        })
    }
}

// update user account to company account 

export const updateUserAccountToCompany = async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            company_name,
            company_landline,
            company_landline_country_code,
            company_trn_number,
            usr_designation
            // company_trade_license,
            // company_trade_license_expiry
        } = req.body;

        const user = await getUserById(userId);




        let company_trade_license_expiry = dayjs.utc(req.body.company_trade_license_expiry).utc(true).format();

        const files = req.files;


        const existingCompany = await checkCompanyExist(company_trn_number);
        if (existingCompany.length) {
            return res.status(409).json({
                status: 409,
                success: false,
                message: "Company already exist",

            });
        }

        if (req.file) {
            const resizedUrl = await resizeAndUpload(req.file);
            company_trade_license = resizedUrl;
        }

        const schema = Joi.object({

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


            // Check if the file is a PDF or JPEG before processing
            if (file.mimetype === 'image/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                // Resize only if it's a PDF, JPEG, PNG 
                const resizedBuffer = await sharp(file.data)
                    .resize(700)
                    .webp({ quality: 90 })  // Adjust quality as needed
                    .jpeg({ quality: 90, progressive: true, force: false })  // Adjust quality and other options as needed
                    .png({ quality: 90, force: false })  // Adjust compression level and other options as needed
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


        // Update user with the new company ID
        const updatedUser = await updateUserAccountInformation(userId, {
            usr_company: newCompany[0].id,
            usr_designation: usr_designation
        });

        await UpdateUserAccountToCompany(user.usr_email, user.usr_firstname, 'company');

        res.status(200).json({
            status: 200,
            success: true,
            message: "User account updated as business account requested successfully wait for admin approval",
            result: updatedUser,

        })

    } catch (error) {

        console.log(error);

        res.status(400).json({
            status: 400,
            success: false,
            message: "failed to update the user",
        })

    }

};


// update company account user






// deactivate user account need to set later 

export const deactivateUserAccount = async (req, res) => {

    const userId = req.params.userId;

    try {

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            })
        }


    } catch (error) {
        console.log(error);
        res.status(400).json({

            status: 400,
            success: false,
            message: "failed to deactivate the user",
        })
    }
};



export const updateUserCompany = async (req, res) => {

    const userId = req.user?.userId;

    let {
        usr_firstname,
        usr_lastname,
        usr_mobile_number,
        usr_mobile_country_code,
        usr_email,
        usr_designation,
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

       // Get the current TRN number for the user
       const currentUserCompany = await getCurrentUserCompanyTrn(userId);
       const currentTrnNumber = currentUserCompany.company_trn_number;

       // Check if the provided TRN number matches the current TRN number
       if (company_trn_number !== currentTrnNumber) {
           return res.status(400).json({
               status: 400,
               success: false,
               message: "Cannot update TRN number. TRN number must remain the same.",
           });
       };


        if (req.file) {
            const resizedUrl = await resizeAndUpload(req.file);
            company_trade_license = resizedUrl;
        };


        // Register company validation 

        const schema = Joi.object({
            usr_firstname: Joi.string().required().label("First Name"),
            usr_lastname: Joi.string().required().label("Last Name"),
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
           

            company_name,
            company_landline,
            company_landline_country_code,
            company_trn_number,


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



            // Check if the file is a PDF or JPEG before processing
            if (file.mimetype === 'image/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                // Resize only if it's a PDF, JPEG, PNG 
                const resizedBuffer = await sharp(file.data)
                    .resize(700)
                    .webp({ quality: 90 })  // Adjust quality as needed
                    .jpeg({ quality: 90, progressive: true, force: false })  // Adjust quality and other options as needed
                    .png({ quality: 90, force: false })  // Adjust compression level and other options as needed
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

        const companyId = currentUserCompany.id

        const updatedCompany = await updateCompany(companyId, {

            company_name,
            company_landline,
            company_landline_country_code,
            company_vat_certificate,
            company_trn_number,
            company_trade_license,
            company_trade_license_expiry,

        });



        const registrationMethod = "manual registration";

        const updatedUser = await updateCompanyUser(userId, {
            usr_firstname,
            usr_lastname,
            usr_mobile_number,
            usr_mobile_country_code,
            usr_email,
            usr_designation,
            usr_tos_accepted,
            usr_newsletter_accepted,
            email_verified: false,
            usr_company: updatedCompany.id,
            is_status: false,
            registration_method: registrationMethod,
            usr_approval_id: 1,
        });



        // Send email verification link
        // await sendVerificationEmail(usr_email, usr_firstname, token, 'company');


        res.status(201).json({
            status: 201,
            success: true,
            message: "Company updated successfully. Wait for admin approval",
            result: {
                updatedUser,
                updatedCompany
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update company! Please try again later."

        });
    }
};
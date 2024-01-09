import bcrypt from 'bcrypt';

import {
    blockUser,
    blockUserPermanently,
    checkUserExist,
    createUser,
    deleteAUser,
    getAllUsersData,
    getCountryDialCode,
    getUserByEmail,
    getUserById,
    getUserByPhoneNumber,
    refreshTokenModel,
    updateEmail,
    updateIncorrectAttempts,
    updateMobile,
    updateOtp,
    updateRegisterOtp,
    updateUser,
    updateUserVerificationStatus,
} from "../models/userModel.js";

import Joi from 'joi';
import { joiOptions } from '../helpers/joiOptions.js';
import getErrorsInArray from '../helpers/getErrors.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/emailer.js';
import sendVerificationCode from '../utils/mobileOtp.js';
import validateAuth from '../middleware/validateAuth.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { iSCompanyStatusVerified } from '../models/companyModel.js';


// gmail and facebook authentication 
// gmail  authentication 


// ________________________________________________________________________________________________________________________________________________________________________________


//Get all users by admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersData();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Users fetch successfull ",
            result: users
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to retrieve users!."

        });
    }
}

export const registerUser = async (req, res) => {


    const {

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
        mobile_verified,



    } = req.body;



    try {

        const existingUser = await checkUserExist(usr_mobile_number, usr_email);
        if (existingUser.length) {
            return res.status(409).json({
                status: 409,
                success: false,
                message: "User already exist",

            });
        }


        // Register user validation 
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
            mobile_verified: Joi.boolean(),
        });

        // Register validation data

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
            mobile_verified,

        };

        const { error } = schema.validate(validate_data, joiOptions);
        if (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Validation Error",
                error: getErrorsInArray(error?.details),
            });
        };

        // password hash using bcrypt 

        const hashedPassword = await bcrypt.hash(usr_password, 12);


        const registrationMethod = "manual registration"

        // creating   new user
        const newUser = await createUser({

            usr_firstname,
            usr_lastname,
            usr_mobile_number,
            usr_mobile_country_code,
            usr_email,

            //  hashed password initialize to usr_password
            usr_password: hashedPassword,
            usr_designation,
            usr_tos_accepted,
            usr_newsletter_accepted,
            email_verified: false,
            mobile_verified: false,
            registration_method: registrationMethod,
            usr_approval_id: 4

        });

        const userId = newUser[0]?.id;




        // jwt user token 
        const token = jwt.sign({ userId, usr_email, usr_firstname, usr_company }, process.env.EMAIL_SECRET, { expiresIn: "600s" });

        // Send email verification link
        await sendVerificationEmail(usr_email, usr_firstname, token, 'individual');

        res.status(201).json({
            status: 201,
            success: true,
            message: "User registration successful. Check your email for verification ",
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
            message: "Failed to create user! Please try again later."

        });
    }
};

export const loginWithPassword = async (req, res) => {

    const { usr_email, usr_password } = req.body;

    try {
        //check if user exists 
        const existingUser = await getUserByEmail(usr_email);
        console.log(existingUser);

        if (!existingUser) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found!"
            });

        };


        // Check if the user is blocked
        if (existingUser.blocked_until && existingUser.blocked_until > new Date()) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: `User is blocked until ${existingUser.blocked_until}. Please try again later.`
            });
        };


        // Check if the user's company is verified
        const userCompany = existingUser.usr_company;

        if (!userCompany === null) {
            const companyVerificationStatus = await iSCompanyStatusVerified(existingUser.usr_company);

            if (!companyVerificationStatus || !companyVerificationStatus.verification_status) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: 'your account activation is under process we will update once your account is active.',
                });
            }

        };

        // Check if the user is blocked by the admin
        if (!existingUser.is_status) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "User is blocked.Please contact admin for assistance."
            });
        }


        // Check if password is correct

        const isPasswordCorrect = await bcrypt.compare(usr_password, existingUser?.usr_password);

        if (!isPasswordCorrect) {
            const attempts = (existingUser.login_attempts || 0) + 1;
            const failedCount = existingUser.failed_count

            if (attempts > 3 && failedCount === 0) {
                // Block the user
                await blockUser(existingUser.id);

                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: `User is blocked for 2 minutes due to too many incorrect attempts. Please try again later.`
                });
            } else if (attempts > 3 && failedCount === 1) {
                // Block the user permanently
                await blockUserPermanently(existingUser.id);

                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: `User is blocked temporary due to repeated incorrect attempts. Contact admin for assistance.`
                });
            };

            // Update the incorrect attempts counter in the database
            await updateIncorrectAttempts(existingUser.id, attempts);

            return res.status(404).json({
                status: 404,
                success: false,
                message: "Invalid email or password!"
            });
        };

        // Reset the incorrect attempts counter upon successful login
        await updateIncorrectAttempts(existingUser.id, 0);


        // Check if both email and mobile are verified
        if (!existingUser.email_verified || !existingUser.mobile_verified) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Email and mobile must be verified to login'
            });
        }


        //create token

        const accessToken = generateAccessToken(existingUser)

        const refreshToken = generateRefreshToken(existingUser)



        // save refresh token to the database
        const saveToken = await refreshTokenModel.saveRefreshToken(refreshToken, existingUser.id)




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

// #endregion


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

        return res.status(200).json({ status: 200, accessToken: newAccessToken, refresh_token: newAccessToken, message: 'Token regenerated successfully' })
    } catch (error) {
        console.log(error);

        return res.status(401).json({ message: 'Invalid refresh token' });
    }

}



// login with otp
export const loginWithOtp = async (req, res) => {
    const { usr_mobile_number } = req.body;

    try {
        //check user exist 

        const existingUser = await getUserByPhoneNumber(usr_mobile_number)


        if (!existingUser) {

            return res.status(404).json({
                status: 404,
                success: false,
                message: "Mobile number not found , please register your mobile number!"
            });
        }


        // Check if the user's company is verified
        const userCompany = existingUser.usr_company;

        if (!userCompany === null) {
            const companyVerificationStatus = await iSCompanyStatusVerified(existingUser.usr_company);

            if (!companyVerificationStatus || !companyVerificationStatus.verification_status) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: 'your account activation is under process we will update once your account is active.',
                });
            }

        };


        // Check if the user is blocked by the admin
        if (!existingUser.is_status) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "User is blocked.Please contact admin for assistance."
            });
        }


        // Check if both email and mobile are verified
        if (!existingUser.email_verified || !existingUser.mobile_verified) {
            return res.status(404).json({ status: 404, success: false, message: 'Email and mobile must be verified to login' });
        }

        // token
        //create token

        const accessToken = generateAccessToken(existingUser)

        const refreshToken = generateRefreshToken(existingUser)



        // save refresh token to the database
        const saveToken = await refreshTokenModel.saveRefreshToken(refreshToken, existingUser.id);




        console.log(accessToken);
        console.log(refreshToken);


        // generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        await updateRegisterOtp(existingUser.id, otp, otpExpiry)
        const country = await getCountryDialCode(userId)
        const countryDialCode = country?.country_dial_code;

        const sendOtp = await sendVerificationCode(existingUser.usr_mobile_number, otp, countryDialCode);
        console.log("phone number", existingUser.usr_mobile_number);
        console.log("otp", otp);
        console.log("sendotps", sendOtp);

        // if (sendOtp) {
        //     // console.log("sendotps", sendOtp);
        //     return res.status(200).json({
        //         status: 200,
        //         message: 'OTP sent successfully',
        //     });
        // } else {
        //     return res.status(500).json({ message: 'Failed to send OTP' });
        // }

        return res.status(200).json({
            status: 200,
            message: 'OTP sent successfully',
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
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
        // generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
        // Set OTP expiry time (e.g., 5 minutes from now)
        if (email_verified) {
            const user = await updateRegisterOtp(userId, otp, otpExpiry)
            const country = await getCountryDialCode(userId)
            const countryDialCode = country?.country_dial_code;

            // Send OTP via SMS
            await sendVerificationCode(user[0]?.usr_mobile_number, user[0].otp, countryDialCode, user[0].otp_expiry);
            return res.status(200).json({
                status: 200,
                message: 'Email verification successful, Check your mobile for verification'
            });
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
    const { token } = req.params;
    console.log(token);
    try {
        const userInfo = await validateAuth(token);
        const user = await getUserById(userInfo.userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        };

        // already email verified
        if (user.email_verified) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Email is already verified. You can close this tab",

            });
        }

        // jwt user token 
        const jwtToken = jwt.sign({
            userId: user.id,
            usr_email: user.usr_email,
            usr_firstname: user.usr_firstname,
            usr_company: user.usr_company,
        },
            process.env.EMAIL_SECRET,
            { expiresIn: "1d" });

        // Send email verification link
        await sendVerificationEmail(user.usr_email, user.usr_firstname, jwtToken);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Email verification link send successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to send email"
        });
    }
};

// #                                                                                                                                                                                                                                                                                                                                                                                                                                                                                



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
        const country = await getCountryDialCode(userInfo.id)
        const countryDialCode = country?.country_dial_code;

        await sendVerificationCode(userInfo.usr_mobile_number, otp, countryDialCode, otpExpiry);


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
    const { token, otp } = req.body;
    const { from } = req.query;

    try {
        const userInfo = await validateAuth(token);
        // OTP valid for 5 minutes
        // Check if OTP is valid and not expired
        const user = await getUserById(userInfo.userId);
        if (!user) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "User not found"
            });
        }

        // console.log(user.otp_expiry);

        if (!user || user.otp !== otp || new Date() > new Date(user.otp_expiry)) {
            console.log("otp", otp);
            console.log(user.otp);
            console.log(user.otp_expiry);
            console.log(user.id);
            return res.status(401).json({ error: 'Invalid OTP or OTP expired' });
        }

        if (user && user.otp === otp) {
            // Clear OTP after successful verification and update
            await updateOtp(user.id, true);

        }

        if (from === 'individual') {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            return res.status(200).json({
                status: 200,
                success: true,
                message: "OTP verified successfully",
                result: {
                    user: {
                        id: user.id,
                        usr_email: user.usr_email,
                        usr_firstname: user.usr_firstname,
                        usr_lastname: user.usr_lastname,
                    },
                    accessToken,
                    refreshToken
                }
            });
        } else {
            // Perform additional user registration steps if needed
            res.status(200).json({
                status: 200,
                message: 'OTP verified successfully',
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, message: 'Failed otp verification', error: error });
    }

};

// verify login otp
export const verifyLoginOtp = async (req, res) => {
    const { usr_mobile_number, otp } = req.body;


    // Check if OTP is valid and not expired
    const user = await getUserByPhoneNumber(usr_mobile_number);
    // console.log(user);
    // console.log(otp);
    if (!user || user.otp !== otp || new Date() > new Date(user.otp_expiry)) {
        // console.log(user.otp);
        // console.log(user.otp_expiry);
        return res.status(404).json({
            status: 404,
            success: false,
            message: 'Invalid OTP or OTP expired'
        });
    }

    if (user && user.otp === otp) {


        // Clear OTP after successful verification
        await updateOtp(user.id);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'otp verified successfully, you are logged in successfully',
            result: {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    usr_email: user.usr_email,
                    usr_firstname: user.usr_firstname,
                    usr_lastname: user.usr_lastname,
                }
            }
        });
    } else {
        return res.status(500).json({ message: 'internal server error please try again' });
    }

}



// region Login 



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

// middleware
export const getUserInformation = async (req, res) => {
    const { token } = req.params;
    console.log(token);
    try {
        const user = await validateAuth(token);
        console.log(user);

        const userInfo = await getUserById(user.userId);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "User found successfully",
            result: userInfo,
        });
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            status: 404,
            success: false,
            message: "User not found"
        });
    }
}


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
};



export const updateEmailUsingToken = async (req, res) => {

    const { token } = req.params;
    const { from } = req.query;
    const { usr_email } = req.body;


    try {
        const user = await validateAuth(token);

        const existingUser = await getUserById(user.userId);
        if (!existingUser) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "User not found"
            });
        };

        // already email verified
        if (existingUser.email_verified) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Email is already verified. You can close this tab",

            });
        }



        await updateEmail(user.userId, usr_email);


        await sendVerificationEmail(usr_email, existingUser.usr_firstname, token, from);


        res.status(200).json({
            status: 200,
            success: true,
            message: "Email updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to update email' });
    }
}



export const updateMobileUsingToken = async (req, res) => {
    const { token } = req.params;
    const { usr_mobile_country_code, usr_mobile_number } = req.body;
    console.log(token);

    try {
        const user = await validateAuth(token);

        const existingUser = await getUserById(user.userId);
        if (!existingUser) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "User not found"
            });
        }



        await updateMobile(user.userId, usr_mobile_country_code, usr_mobile_number,);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Mobile number  updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to update mobile' });
    }
}


// update using details 
export const updateUserDetails = async (req, res) => {
    const userId = req.params.userId;
    const newData = req.body

    try {

        const existingUser = await getUserById(userId);
        if (!existingUser) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
        }

        // Check if the password is provided in the newData
        if (newData.usr_password) {
            // Hash the new password
            newData.usr_password = await bcrypt.hash(newData.usr_password, 12);
        }

        const updatedUser = await updateUser(userId, newData);
        res.status(200).json({
            status: 200,
            success: true,
            message: "User updated successfully",
            result: newData,
        });
    } catch (error) {

        res.status(400).json({
            status: 400,
            success: false,
            message: "failed to update the user",
            error: error
        });
    }
};



export const sendMessage = (req, res) => {
    const io = req.app.get("socketio");

    // Example data
    const data = {
        email: "user@example.com",
        message: "Hello, world!",
    };

    // Emit the message to the specified email room
    io.to(data.email).emit("receiveMessage", data);

    res.json({ success: true });
};





import bcrypt from 'bcrypt';
import { createUser, getUser, getUserByEmail, updateUserVerificationStatus } from "../models/userModel.js";
import Joi from 'joi';
import { joiOptions } from '../helpers/joiOptions.js';
import getErrorsInArray from '../helpers/getErrors.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../mailer/emailer.js';




// creating a user functions 
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


    } = req.body;



    try {



        // Register user validation 
        const schema = Joi.object({
            usr_firstname: Joi.string().required().label("First Name"),
            usr_lastname: Joi.string().required().label("Last Name"),
            usr_mobile_number: Joi.string().required().label("Mobile Number"),
            usr_mobile_country_code: Joi.number().required().label("Country Code"),
            usr_email: Joi.string().required().label("Email"),
            usr_password: Joi.string().required().label("Password"),
            usr_designation: Joi.string().required().label("Designation"),
            usr_company: Joi.number().required().label("Company"),
            usr_tos_accepted: Joi.boolean().required().label("Term Of Use"),
            usr_newsletter_accepted: Joi.boolean().required().label("Newsletter"),
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
            usr_company,
            usr_tos_accepted,
            usr_newsletter_accepted
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
            usr_company,
            usr_tos_accepted,
            usr_newsletter_accepted
        });

        // jwt user token 
        const token = jwt.sign({ usr_email, usr_firstname, usr_company }, process.env.JWT_SECRET, { expiresIn: "15d" });

        // Send email verification link
        sendVerificationEmail(usr_email, token);
        res.status(200).json({
            status: 200,
            success: true,
            message: "User registration successful. Check your email for verification.",
            result: newUser,
            userToken: {
                token,
                user: {

                    usr_email: usr_email,
                    usr_firstname: usr_firstname,
                    usr_lastname: usr_lastname,
                    usr_company: usr_company,

                }
            }
        });



    } catch (error) {

        console.log(error);

        // Check if the error is due to a unique 
        if (error.code === '23505') {
            return res.status(500).json({
                status: 403,
                success: false,
                message: "User already exist",
                error: error?.detail
            });

        } else {
            console.error('Error inserting user:', error);
        }


        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create user! Please try again later."

        });
    }
};







export const verifyEmail = async(req, res) => {
    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET );
        const userId = decoded.userId;
        
        
    // Update user verification status
    const updateUserVerificationStatus = await updateUserVerificationStatus(userId, true);
    res.json({ message: 'Email verification successful.' });

    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
}













// Login 

export const loginUser = async (req, res) => {
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

        const token = jwt.sign({ usr_email: existingUser.usr_email, id: existingUser.id },
            process.env.JWT_SECRET, { expiresIn: "15d" });

        //send token to client 
        res.status(200).json({
            status: 200,
            success: true,
            message: "Logged in successfully!",
            result: {
                token,
                user: {
                    id: existingUser.id,
                    usr_email: existingUser.usr_email,
                    usr_firstname: existingUser.usr_firstname,

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









// Get a single user
export const getSingleUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUser(id);

        if (!user.length) {
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
        // console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get user! Please try again later."

        });
    }
};




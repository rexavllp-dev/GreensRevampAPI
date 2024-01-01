import { joiOptions } from "../helpers/joiOptions.js";
import { isActive, isNotActive } from "../models/adminModel.js";
import { checkUserExist, createUser } from "../models/userModel.js";
import Joi from 'joi';
import bcrypt from 'bcrypt';





export const adminUserRegister = async (req, res) => {
    const {

        usr_firstname,
        usr_lastname,
        usr_mobile_number,
        usr_mobile_country_code,
        usr_email,
        usr_password,
        is_role,
        notes
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
        });

        // Register validation data

        const validate_data = {
            usr_firstname,
            usr_lastname,
            usr_mobile_number,
            usr_mobile_country_code,
            usr_email,
            usr_password,
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
        // Generate a random 6-digit verification code

        // creating   new user
        const newUser = await createUser({

            usr_firstname,
            usr_lastname,
            usr_mobile_number,
            usr_mobile_country_code,
            usr_email,
            //  hashed password initialize to usr_password
            usr_password: hashedPassword,
            is_role,
            notes

        });

        const userId = newUser[0]?.id;
        // jwt user token 
        // const token = jwt.sign({ userId, usr_email, usr_firstname }, process.env.JWT_ACCESS, { expiresIn: "600s" });

        res.status(201).json({
            status: 201,
            success: true,
            message: "user registration successful.",
            result: {

                user: {
                    userId,
                    usr_email,
                    usr_firstname,
                    usr_lastname,
                    is_role
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


// is active for admin  

export const isActiveByAdmin = async (req, res) => {
    const { userId } = req.params;

    try {
        const userStatus = await isActive(userId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "User Activated successfully",
            result: userStatus,
        });

    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Failed",
        });
    }

};


//  user deactivate for admin 
export const isNotActiveByAdmin = async (req, res) => {
    const { userId } = req.params;

    try {
        const userStatus = await isNotActive(userId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "User Deactivated successfully",
            result: userStatus,
        });

    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Failed",
        });
    }

};


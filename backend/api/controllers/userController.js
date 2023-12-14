import { createUser, getUserByEmail } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        // console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create user! Please try again later."
            
        });
    }
};


//login user

export const login = async (req,res) => {
    const {usr_email, usr_password} = req.body;

    try {
        //check if user exists 
        const existingUser = await getUserByEmail(usr_email);

        if(!existingUser) {
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

         const token = jwt.sign({usr_email : existingUser.usr_email, id: existingUser.id},
            process.env.JWT_SECRET, {expiresIn:"15d"});

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









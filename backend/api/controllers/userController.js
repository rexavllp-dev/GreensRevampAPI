import { createUser } from "../models/userModel.js";


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

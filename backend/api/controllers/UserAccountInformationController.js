import { updateUserAccountInformation } from "../models/userAccountInformationModel.js";
import { getUserById } from "../models/userModel.js";

// update user account information
export const updateUserAccountInformations = async (req, res) => {
    
    const userId = req.params.userId;
    const newData = req.body;

    try {
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
        
        res.status(400).json({
            status: 400,
            success: false,
            message: "failed to update the user",
        })
    }
}
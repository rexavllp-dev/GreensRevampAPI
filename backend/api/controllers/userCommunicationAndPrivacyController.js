import { updateUserCommunicationAndPrivacy } from "../models/userCommunicationAndPrivacy.js";
import { getUserById } from "../models/userModel.js";

// user communication and privacy 
export const userCommunicationAndPrivacy = async (req, res) => {
    
    const userId = req.user.userId;

     // Destructure properties from req.body
     const {
        usr_marketing_email,
        usr_saving_email,
        usr_review_email,
        usr_customer_survey,
        usr_information_sharing,
        usr_newsletter_accepted
    } = req.body;

     const data = {

         usr_marketing_email,
         usr_saving_email,
         usr_review_email,
         usr_customer_survey,
         usr_information_sharing,
         usr_newsletter_accepted

     } 


    try {
        
        const user = await getUserById(userId);

        if(!user){
            return res.status(404).json({
                status: 404,
                success: false,
                message : "User not found"
            })
        }

       const updateUser = await updateUserCommunicationAndPrivacy(userId, data);

        res.status(200).json({
            status: 200,
            success: true,
            message : "User communication and privacy updated successfully",
            result : updateUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message : "Failed to update user communication and privacy",
        })
    }
}
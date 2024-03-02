import { createPrivacyPolicy, deletePrivacyPolicy, getPrivacyPolicy, updatePrivacyPolicy } from "../models/privacyPoliciesModel.js";


// create privacy policy
export const AddPrivacyPolicy = async (req, res) => {
    const privacyPolicyData = req.body;
    try {
        const newPrivacyPolicy = await createPrivacyPolicy(privacyPolicyData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Privacy policy created successfully",
            result: newPrivacyPolicy
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create privacy policy",
            error: error
        });
    }
};

// update privacy policy

export const updatePrivacyPolicyById = async (req, res) => {
    const privacyPolicyId = req.params.id;
    const privacyPolicyData = req.body;

    try {
        
        const updatedPrivacyPolicy = await updatePrivacyPolicy(privacyPolicyId, privacyPolicyData);

        res.status(200).json({
            
            status: 200,
            success: true,
            message: "Privacy policy updated successfully",
            result: updatedPrivacyPolicy
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update privacy policy",
        })
    }
}

// get privacy policy

export const getALLPrivacyPolicy = async (req, res) => {

    try {

        const privacyPolicy = await getPrivacyPolicy();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Privacy policy fetched successfully",
            result: privacyPolicy
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch privacy policy",
            error: error
        });
    }
}

// delete privacy policy

export const deletePrivacyPolicyById = async (req, res) => {
    const privacyPolicyId = req.params.id;

    try {

        const deletedPrivacyPolicy = await deletePrivacyPolicy(privacyPolicyId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Privacy policy deleted successfully",
            result: deletedPrivacyPolicy
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete privacy policy",
            error: error
        });
    }
}
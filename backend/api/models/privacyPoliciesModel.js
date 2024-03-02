import db from '../../config/dbConfig.js';


// create privacy policy
export const createPrivacyPolicy = async (privacyPolicyData) => {
    const newPrivacyPolicy = await db("privacy_policies").insert(privacyPolicyData).returning("*");
    return newPrivacyPolicy;
}

// get privacy policy

export const getPrivacyPolicy = async () => {
    const privacyPolicy = await db("privacy_policies").select("*");
    return privacyPolicy;

}


// update privacy policy

export const updatePrivacyPolicy = async (privacyPolicyId, updatedData) => {
    const updatedPrivacyPolicy = await db("privacy_policies").where({ id: privacyPolicyId })
        .update(updatedData)
        .returning("*");

    return updatedPrivacyPolicy;
}


// delete privacy policy

export const deletePrivacyPolicy = async (privacyPolicyId) => {
    const deletedPrivacyPolicy = await db("privacy_policies").where({ id: privacyPolicyId })
        .del()
        .returning("*");

    return deletedPrivacyPolicy;
}






import db from '../../config/dbConfig.js';


export const isActive = async (userId) => {
    await db('users').where({ id: userId }).update({ is_status: true });
}

export const isNotActive = async (userId) => {
    await db('users').where({ id: userId }).update({ is_status: false });
}

// if registered verification will be true

export const updateUserVerificationByAdmin = async (userId) => {
    const user = await db('users').where({ id: userId }).update({ email_verified: true, mobile_verified: true });
    return user;
};


// update company status
export const updateCompanyStatus = async (companyId, approvalId, verificationStatus) => {

    const updateUserResult = await db('users')
        .where({ "usr_company": companyId })
        .update({
            'usr_approval_id': approvalId,
        });

    const updateCompanyResult = await db('company')
        .where({ "id": companyId })
        .update({
            'verification_status': verificationStatus,
        });

    // You can check the results or handle them as needed

    return { updateUserResult, updateCompanyResult };
};


export const fetchSingleCompany = async (companyId) => {
    const companyData = await db('company')
        .leftJoin('users', 'users.usr_company', 'company.id')
        .select("company.*", "users.*")
        .where('company.id', companyId)
        .first();
    return companyData;
};




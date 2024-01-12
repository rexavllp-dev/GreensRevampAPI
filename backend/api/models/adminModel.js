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



export const updateCompanyStatus = async (companyId, approvalId, verificationStatus) => {
    return await db('company')
        .leftJoin('users', 'users.usr_company', 'company.id')
        .where({ "company.id": companyId })
        .update({
            "users.usr_approval_id": approvalId,
            "company.verification_status": verificationStatus,
        });
};


export const fetchSingleCompany = async (companyId) => {
    const companyData = await db('company')
        .leftJoin('users', 'users.usr_company', 'company.id')
        .select("company.*", "users.*")
        .where('company.id', companyId)
        .first();
    return companyData;
};




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
export const updateCompanyStatus = async (companyData) => {

    console.log(companyData.approvalId);

    const updateUserResult = await db('users')
        .where({ "usr_company": companyData.companyId })
        .update({
            'usr_approval_id': companyData.approvalId,
        });

    const updateCompanyResult = await db('company')
        .where({ "id": companyData.companyId })
        .update({
            'verification_status': companyData.verificationStatus,
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



// approve and reject Bulk Above Max Orders by admin
export const approveBulkMaxOrder = async (bulkId) => {
    return db('bulk_above_max_orders')
        .where({ id: bulkId })
        .update({ approved_status: true })


};

export const rejectBulkMaxOrder = async (bulkId) => {
    return db('bulk_above_max_orders')
        .where({ id: bulkId })
        .update({ approved_status: false })

};



export const getUserFromBulkOrder = async (bulkId) => {
    const user = await db('bulk_above_max_orders')
    .where({ 'bulk_above_max_orders.id': bulkId })
    .join('users', 'users.id', '=', 'bulk_above_max_orders.user_id')
    .select('users.*');
};



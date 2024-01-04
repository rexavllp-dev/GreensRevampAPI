import db from '../../config/dbConfig.js';


export const isActive = async( userId ) => {
    await db('users').where({ id: userId }).update({ is_status: true });
}

export const isNotActive = async( userId ) => {
    await db('users').where({ id: userId }).update({ is_status: false });
}

// if registered verification will be true

export const updateUserVerificationByAdmin = async (userId) => {
const user = await db('users').where({ id: userId }).update({ email_verified: true, mobile_verified: true });
return user;
};



export const verifyCompany = async( companyId ) => {
    return await db('company').where({ id: companyId }).update({ verification_status: true });
};


export const fetchSingleCompany = async( companyId ) => {
    const companyData = await db('company')
    .leftJoin('users', 'users.usr_company', 'company.id')
    .select("*")
    .where('company.id', companyId)
    .first();
    return companyData
    // return await db('company').leftJoin('users', 'users.usr_company', 'users.id').orderBy('users.id', 'desc').select("*").where({ id: companyId })
};



export const notverifyCompany = async( companyId ) => {
    return await db('company').where({ id: companyId }).update({ verification_status: false });
};

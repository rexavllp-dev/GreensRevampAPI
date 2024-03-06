import db from '../../config/dbConfig.js';
import ms from 'ms';

// Get all users
export const getAllUsersData = async () => {

    const allUsers = await db("users")
        .leftJoin('company', 'users.usr_company', 'company.id')
        .leftJoin('user_approval_status', 'users.usr_approval_id', 'user_approval_status.id')
        .orderBy('users.id', 'desc')
        .select("users.*", "company.company_name", "company.company_landline_country_code", "company.company_landline",
            "company.company_vat_certificate", "company.company_trn_number", "company.company_trade_license",
            "company.company_trade_license_expiry", "company.verification_status", "user_approval_status.status_name");
    return allUsers;

};




// creating a function createUser for register a user 
export const createUser = async (data) => {
    const newUser = await db("users").insert(data).returning('*');
    return newUser;
};

// update the user details
export const updateUser = async (userId, newData) => {
    const user = await db('users').where({ id: userId }).update(newData).returning('*');
    return user;
};


//  check user exist
export const checkUserExist = async (usr_mobile_number, usr_email) => {
    const user = await db('users').select('id').where({ usr_mobile_number }).orWhere({ usr_email });
    return user;
};


//  check user exist with mobile number
export const checkUserExistWithMobile = async (usr_mobile_number) => {
    const user = await db('users').select('id').where({ usr_mobile_number });
    return user;
};

// user already exist with country code
export const checkUserExistWithMobileAndCountryCode = async (usr_mobile_country_code, usr_mobile_number) => {
    const existingUser = await db('users')
        .where({
            'usr_mobile_country_code': usr_mobile_country_code,
            'usr_mobile_number': usr_mobile_number
        })
        .select('*');
    return existingUser;
};

export const deleteAUser = async (userId) => {
    // const user = await db('users').where({ id: userId }).del();
    const bulk = await db('bulk_above_max_orders').del();
    const user = await db('users').del();
    const com = await db('company').del();
    return user;
};

// update the email when verify the email 
export const updateEmail = async (userId, usr_email) => {
    const user = await db('users').where({ id: userId }).update({ usr_email });
    return user;
};

// update the mobile number when verify the mobile number
export const updateMobile = async (userId, usr_mobile_country_code, usr_mobile_number) => {
    const user = await db('users').where({ id: userId }).update({ usr_mobile_country_code, usr_mobile_number });
    return user;
};

// _________________________________________________________________________________________________________________________________________________

//login user

export const getUserByEmail = async (usr_email) => {
    const user = await db("users").select("*").where({ usr_email }).first();
    return user;
};


//forgot password query

// Store the reset token in the database

export const userForgotPassword = async (usr_email) => {
    const user = await db("users").select("*").where({ usr_email }).first();
    return user;
};

//update reset token
export const updateResetToken = async (usr_email, token, expiresAt) => {
    return db('users').where({ usr_email }).update({ reset_token: token, reset_token_expires_at: expiresAt })
};

//update password and then clear the resetToken and exipry Date from database
export const updatePassword = async (id, hashedPassword) => {
    return db("users").where({ id }).update({
        usr_password: hashedPassword,
        reset_token: null,
        reset_token_expires_at: null
    })
};


// find resetToken from database

export const findByResetToken = async (reset_token) => {
    // console.log(resetToken)
    const user = await db("users").select("*").where({ reset_token }).first();
    return user;
};

// forgot password end here
// ________________________________________________________________________________________________________________________________________________________________________________________________________________


// refresh Token 

export const refreshTokenModel = {

    // create Token to database
    saveRefreshToken: async (refreshToken, userId) => {

        return await db('users').where({ id: userId }).update({ refresh_token: refreshToken });
    },

    // Find Token from database

    findRefreshToken: async (userId, refreshToken) => {
        return await db('users').where({ id: userId, refresh_token: refreshToken }).first();
    },

    // update token from database

    updateResetToken: async (userId, refresh_token) => {
        return await db('users').where({ id: userId }).update({ refresh_token })
    }

};


// ______________________________________________________________________________________________________________________________________________


export const insertRefreshToken = async (userId, refreshToken) => {
    const user = db('users').insert({ id: userId, refresh_token: refreshToken });
    return user;
};

// email verification
export const updateUserVerificationStatus = async (userId, email_verified) => {
    const [updatedUser] = await db('users')
        .where({ id: userId })
        .update({ email_verified })
        .returning('*');

    return updatedUser && updatedUser.email_verified;
};


// mobile "verification"


export const getUserById = async (usr_id) => {
    // console.log("userId" , usr_id);
    const user = await db('users')
        .leftJoin('company', 'company.id', 'users.usr_company')
        .leftJoin('countries', 'countries.id', 'users.usr_mobile_country_code')
        .leftJoin('user_approval_status', 'user_approval_status.id', 'users.usr_approval_id')
        .select("users.*", "company.company_name", "company.company_landline_country_code", "company.company_landline",
            "company.company_vat_certificate", "company.company_trn_number", "company.company_trade_license",
            "company.company_trade_license_expiry", "company.verification_status", "countries.country_name",
            "countries.country_code", "countries.country_dial_code", "user_approval_status.status_name")
        .where({ 'users.id': usr_id }).first();
    return user;
};

export const getUserByPhoneNumber = async (usr_mobile_number) => {
    const user = await db('users').select("*").where({ usr_mobile_number }).first();
    return user;
};


export const updateUserMobileVerificationStatus = async (usr_mobile_number) => {
    const user = await db('users').where({ usr_mobile_number }).update({ mobile_verified: true });
    return user;
};

// Clear OTP after successful verification and update the status
export const updateOtp = async (id, mobile_verified) => {
    const user = await db('users').where({ id }).update({
        otp: null,
        otp_expiry: null,
        mobile_verified,

    });
    return user;
};

export const updateRegisterOtp = async (id, otp, otpExpiry) => {
    const user = await db('users').where({ id }).update({
        otp: otp,
        otp_expiry: otpExpiry
    }).returning('*')
    return user;
};


export const getCountryDialCode = async (id) => {
    const country = await db('users')
        .leftJoin('countries', 'users.usr_mobile_country_code', 'countries.id',)
        .select('users.*', 'countries.country_dial_code as country_dial_code')
        .where({ "users.id": id })
        .first();
    return country;
};




export const findUserById = async (id) => {
    const user = await db('users').where({ id }).first();
    return user
};





// _________________________________________________________________________________________________________________________________________

// gmail authentication

export const getUserByGoogleId = async (googleId) => {
    const user = await db('users').where({ google_id: googleId }).first();
    return user;
};


export const updateUserGoogleId = async (userId, googleId) => {
    const user = await db('users')
        .where({ id: userId })
        .update({ google_id: googleId, email_verified: true });
    return user;
};

export const createGoogleUser = async (googleId, displayName, email, registrationMethod) => {

    const names = displayName.split(' ');
    console.log(names);
    const user = await db('users').insert({
        google_id: googleId,
        display_name: displayName,
        usr_firstname: names[0],
        usr_lastname: names[1],
        usr_email: email,
        email_verified: true,
        registration_method: registrationMethod,

    }).returning('*');

    return user[0]
};


// facebook authentication

export const getUserByFacebook = async (facebookId) => {
    const user = await db('users').where({ facebook_id: facebookId }).first();
    return user;
};


export const createFacebookUser = async (facebookId, displayName, registrationMethod) => {
    const names = displayName.split(' ');
    const user = await db('users').insert({
        facebook_id: facebookId,
        display_name: displayName,
        usr_firstname: names[0],
        usr_lastname: names[1],
        registration_method: registrationMethod,

    }).returning('*');
    return user[0];
};

// user registration 

export const updateUserRegistrationMethod = async (userId, registrationMethod) => {
    await db('users').where({ id: userId }).update({ registration_method: registrationMethod })
}


// Function to update incorrect attempts
export const updateIncorrectAttempts = async (userId, attempts) => {
    await db("users").where({ id: userId }).update({ login_attempts: attempts });
};

// Function to block user
export const blockUser = async (userId) => {
    const blockedUntil = new Date(Date.now() + ms('2m')); // Block for 2 minutes
    return await db("users").where({ id: userId }).update({ blocked_until: blockedUntil, login_attempts: 0, failed_count: 1 });

};

export const blockUserPermanently = async (userId) => {
    // Set blocked_until to null for permanent block
    return await db("users").where({ id: userId }).update({ blocked_until: null, attempt_blocked: true, login_attempts: 0, failed_count: 0 });
};


// login resend otp cooldown

export const updateLastResendTime = async (userId, currentTime) => {
    const updatedUser = await db("users").where({ id: userId }).update({ last_resend_time: currentTime });
    return updatedUser;
};


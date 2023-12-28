import db from '../../config/dbConfig.js';
import bcrypt from 'bcrypt'
// creating a function createUser for register a user 
// creating a function createUser for register a user
export const createUser = async (data) => {
    const { usr_password, ...otherData } = data;
    // Hash the password
    const hashedPassword = await bcrypt.hash(usr_password, 10);
    // Insert the user data with the hashed password
    const newUser = await db("users").insert({ ...otherData, usr_password: hashedPassword }).returning('*');
    return newUser;
}






//login user

export const getUserByEmail = async (usr_email) => {
    const user = await db("users").select("*").where({ usr_email }).first();
    return user;
}

//forgotpassword querys
// Store the reset token in the database

export const userforgotPassword = async (usr_email) => {
    const user = await db("users").select("*").where({ usr_email }).first();
    return user;
}

//update reset token
export const updateResetToken = async (usr_email, token, expiresAt) => {
    return db('users').where({ usr_email }).update({ resetToken: token, reset_token_expires_at: expiresAt })
}

//update password and then clear the resetToken and exipry Date from database
export const updatePassword = async (id, hashedPassword) => {
    return db("users").where({ id }).update({
        usr_password: hashedPassword,
        resetToken: null,
        reset_token_expires_at: null
    })
}

// find resetToken from database

export const findByresetToken = async (resetToken) => {
    // console.log(resetToken)
    const user = await db("users").select("*").where({ resetToken }).first();
    return user;
}
// forgot password end here




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


// mobile otp login

export const getUserById = async (usr_id) => {
    const user = await db('users').select("*").where({ id: usr_id }).first();
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

// save otp and expiry date in database

export const saveOtp = async (id, otpCode, otpExpiry) => {

    return await db('users').where({ id }).update({ login_otp: otpCode, login_otp_expiry: otpExpiry });
}


// resend otp and update to the database

export const resendUpdateLoginOtp = async (id, otpCode, otpExpiry) => {
    const user = await db('users').where({ id }).update({
        login_otp: otpCode,
        login_otp_expiry: otpExpiry
    })
}


// Clear OTP after successful verification
export const updateOtp = async (id) => {
    const user = await db('users').where({ id }).update({
        login_otp: null,
        login_otp_expiry: null
    })
}


// social authenthications facebook and google

export const getUserByIdsocial = async (id) => {
    const user = await db('users').where({ id }).first();
    return user;
}

// get user by google id

export const findByGoogleId = async (googleId) => {
    const user = await db('users').where({ google_id: googleId }).first()
    return user;
}

// get user by facebook
// export const getUserByFacebookId = async(facebookId) => {
//     const user = await db('users').where({facebook_id:facebookId}).first()
//     return user;
// }

// create user from social login

export const createsocialUser = async (googleId, displayName) => {
    const names = displayName.split(' ');
    console.log(names);
    const user = await db('users').insert({
        google_id: googleId,
        display_name: displayName,
        usr_firstname: names[0],
        usr_lastname: names[1],
    });

    return user;
};

// block and unblock user

export const blockUser = async(userId) => {
    await db('users').where({id:userId}).update({is_blocked:true});
}


export const unblockUser = async(userId) => {
    await db('users').where({id:userId}).update({is_blocked:false});
}
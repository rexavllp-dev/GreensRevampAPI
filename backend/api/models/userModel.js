import db from '../../config/dbConfig.js';

// creating a function createUser for register a user 
export const createUser = async (data) => {

    const newUser = await db("users").insert(data).returning('*');
    return newUser;

};
//  check user exist
export const checkUserExist = async (usr_mobile_number, usr_email) => {
    const user = await db('users').select('id').where({ usr_mobile_number }).orWhere({ usr_email });
    return user;
};

export const deleteAUser = async (userId) => {
    const user = await db('users').where({ id: userId }).del();
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
}

//update reset token
export const updateResetToken = async (usr_email, token, expiresAt) => {
    return db('users').where({ usr_email }).update({ reset_token: token, reset_token_expires_at: expiresAt })
}

//update password and then clear the resetToken and exipry Date from database
export const updatePassword = async (id, hashedPassword) => {
    return db("users").where({ id }).update({
        usr_password: hashedPassword,
        reset_token: null,
        reset_token_expires_at: null
    })
}


// find resetToken from database

export const findByResetToken = async (reset_token) => {
    // console.log(resetToken)
    const user = await db("users").select("*").where({ reset_token }).first();
    return user;
}

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
}

// email verification
export const updateUserVerificationStatus = async (userId, email_verified) => {
    const [updatedUser] = await db('users')
        .where({ id: userId })
        .update({ email_verified })
        .returning('*');

    return updatedUser && updatedUser.email_verified;
}


// mobile verification


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
    });
    return user;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// Facebook gmail authentication

// Function to find a user by their Google ID

export const findUserByGoogleId = async (googleId) => {
    const user = await db('users').where({ google_id: googleId }).first();
    return user;
};

// Function to create a new user with Google authentication

export const createUserWithGoogle = async (googleId, email) => {
    const user = await db('users').insert({ google_id: googleId, usr_email: email }).returning('*');
    return user;
};

// Function to find a user by their Facebook ID

export const findUserByFacebookId = async (facebookId) => {
    const user = await db('users').where({ facebook_id: facebookId }).first();
    return user;
};

// Function to create a new user with Facebook authentication

export const createUserWithFacebook = async (facebookId, email) => {
    const user = await db('users').insert({ facebook_id: facebookId, usr_email: email }).returning('*');
    return user;
};


export const findUserById = async (id) => {
    const user = await db('users').where({ id }).first();
    return user
};








import express from 'express';
import {

    deleteUser,
    getAllUsers,
    getSingleUser,
    getUserDetails,
    getUserInformation,
    loginWithOtp,
    loginWithPassword,
    refreshAccessToken,
    registerUser,
    resendEmail,
    resendLoginOtp,
    resendOtp,
    updateEmailUsingToken,
    updateMobileUsingToken,
    updateUserDetails,
    verifyEmail,
    verifyLoginOtp,
    verifyOtp
} from '../controllers/userController.js';

import { forgotPassword, resetPassword } from '../controllers/forgotPasswordController.js';
import passport from 'passport';
import { facebookAuth, googleAuth } from '../controllers/facebookAndGmailController.js';
import { ChangeUserPassword, updateUserAccountInformations, updateUserAccountToCompany } from '../controllers/UserAccountInformationController.js';
import { returnProduct } from '../controllers/returnController.js';
import verifyToken from '../middleware/verifyToken.js';
import { replaceAProduct } from '../controllers/replaceController.js';




// user routes

const router = express.Router();


//get all users
router.get('/all', getAllUsers);

// register routes
router.post('/register', registerUser);

// login user
router.post('/login', loginWithPassword);

// login with otp 
router.post('/login-otp', loginWithOtp);

// refresh token
router.post('/refresh-token', refreshAccessToken);

// verify email
router.get('/verify-email', verifyEmail);

// verify register  otp
router.post('/verify-otp', verifyOtp);

// verify login otp
router.post('/verify-login-otp', verifyLoginOtp);


// for email resend
router.get('/resendemail/:token', resendEmail);

// for mobile resend
router.get('/resendotp/:token', resendOtp);

// login rend otp
router.post('/resend-login-otp', resendLoginOtp);

// forgot password
router.post('/forgot-password', forgotPassword);

// reset password 
router.post('/reset-password', resetPassword);


// get single user
router.get('/:id', getSingleUser);

router.get('/getuserinfo/:token', getUserInformation);

// get user details by middleware
router.get('/user-details', verifyToken, getUserDetails);

// update using email  using token
router.put('/update_email/:token', updateEmailUsingToken);

// update using mobile number  using token
router.put('/update_mobile_number/:token', updateMobileUsingToken);

// update the user details 
router.put('/update-user/:userId', updateUserDetails);

// delete a user
router.delete('/deleteUser/:id', deleteUser);

// google authentication routes

router.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleAuth);


// facebook authentication routes

router.get("/auth/facebook", passport.authenticate('facebook', { scope: ['profile', 'email'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), facebookAuth);


// update user account information in user dashboard

router.put('/update-user-account-information/:userId', updateUserAccountInformations);

// change user password 
router.post('/change-password/:userId', verifyToken, ChangeUserPassword);

// update user account to company account

router.put('/update-user-account-to-company/:userId', updateUserAccountToCompany);


// user return products routes 
router.post('/return-product', verifyToken, returnProduct);

// user replacement products routes
router.post('/replace-product', verifyToken, replaceAProduct)

export default router;


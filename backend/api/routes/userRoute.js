import express from 'express';
import {
 
    deleteUser,
   
    getSingleUser,
    getUserInformation,
    loginWithOtp,
    loginWithPassword,
    registerUser,
    resendEmail,
    resendOtp,
    updateEmailUsingToken,
    updateMobileUsingToken,
    verifyEmail,
    verifyLoginOtp,
    verifyOtp

} from '../controllers/userController.js';






// user routes

const router = express.Router();



// register routes
router.post('/register', registerUser);
// login user
router.post('/login', loginWithPassword);
// login with otp 
router.post('/login-otp', loginWithOtp);
// verify email
router.get('/verify-email', verifyEmail);
// verify register  otp
router.post('/verify-otp', verifyOtp);
// verify login otp
router.post('/verify-login-otp', verifyLoginOtp);
// for email resend
router.post('/resendemail', resendEmail);
// for mobile resend
router.get('/resendotp/:token', resendOtp);
// get single user
router.get('/:id', getSingleUser);
router.get('/getuserinfo/:token', getUserInformation);
// update using email  using token
router.put('/update_email/:token', updateEmailUsingToken);
// update using mobile number  using token
router.put('/update_mobile_number/:token', updateMobileUsingToken);
// delete a user
router.delete('/deleteUser/:id', deleteUser);



export default router;
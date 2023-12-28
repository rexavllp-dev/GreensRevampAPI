import express from 'express';
import {  blockUserbyadmin, login,  loginWithOtp,  refreshAccessToken,  registerUser, resendLoginOtp, unblockUserbyadmin, verifyLoginOtp } from '../controllers/userController.js';
import { forgotPassword, resetPssword } from '../controllers/forgotPasswordController.js';
//   import { googleCallback, googleLogin } from '../controllers/passportController.js';
import passport from 'passport';


// user routes

const router = express.Router();


// authenthication routes
router.post('/register', registerUser);
router.post('/login-otp', loginWithOtp);
router.post('/verify-login-otp', verifyLoginOtp);
router.post('/resend-login-otp', resendLoginOtp);
router.post('/login', login); 
router.post('/refresh-token', refreshAccessToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPssword)


// router.get('/auth/google', googleLogin) 
// router.get('/auth/google/callback', googleCallback)


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/'}),
(req,res) => res.redirect("/"));


// unblock and block user routes

router.put ('/block/:userId', blockUserbyadmin)
router.put ('/unblock/:userId', unblockUserbyadmin)



export default router;
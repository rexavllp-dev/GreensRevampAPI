import express from 'express';
import { facebookAuth, facebookAuthCallback, getUserInfo, googleAuth, googleAuthCallback } from '../controllers/userController.js';


const router = express.Router();

// Define routes for Google and Facebook authentication

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookAuthCallback);


// Route to display user information
app.get('/', getUserInfo);


export default router;
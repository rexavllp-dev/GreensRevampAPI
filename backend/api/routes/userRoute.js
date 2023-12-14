import express from 'express';
import { login, registerUser } from '../controllers/userController.js';


// user routes

const router = express.Router();


// register routes
router.post('/register', registerUser);
router.post('/login', login)


export default router;
import express from 'express';
import { getSingleUser, loginUser, registerUser } from '../controllers/userController.js';

// user routes

const router = express.Router();


// register routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getSingleUser);


export default router;
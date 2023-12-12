import express from 'express';
import { registerUser } from '../controllers/userController.js';

// user routes

const router = express.Router();


// register routes
router.post('/', registerUser);


export default router;
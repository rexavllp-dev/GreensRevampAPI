import express from 'express';
import {  adminUserRegister, isActiveByAdmin, isNotActiveByAdmin } from '../controllers/adminController.js';


const router = express.Router();

// admin can create user
router.post("/create_user", adminUserRegister);

// not suspend user
router.put ('/activate/:userId', isActiveByAdmin);

// suspend user
router.put ('/deactivate/:userId', isNotActiveByAdmin);


export default router;
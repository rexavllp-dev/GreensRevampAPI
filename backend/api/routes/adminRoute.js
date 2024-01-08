import express from 'express';
import { adminUserRegister, approveCompanyByAdmin, isActiveByAdmin, isNotActiveByAdmin, rejectCompanyByAdmin } from '../controllers/adminController.js';


const router = express.Router();

// admin can create user
router.post("/create-user", adminUserRegister);
// not suspend user
router.put('/activate/:userId', isActiveByAdmin);
// suspend user
router.put('/deactivate/:userId', isNotActiveByAdmin);
//  verify company
router.put('/approve/:companyId', approveCompanyByAdmin);
//  reject company verification  company
router.put('/reject/:companyId', rejectCompanyByAdmin);

export default router;



import express from 'express';
import { adminUserRegister,  approveCompanyByAdmin, isActiveByAdmin, isNotActiveByAdmin,  rejectCompanyByAdmin } from '../controllers/adminController.js';
import {  updateAndApproveOrRejectBulkOrders } from '../controllers/bulkController.js';
import { getAllReturnsForAdmin, getSingleReturn } from '../controllers/returnController.js';


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

// admin can approve bulk above max orders
// approve Bulk Max Order and reject 
router.put('/update-bulk-request/:bulkId', updateAndApproveOrRejectBulkOrders);


// admin return

// get all returns for admin
router.get('/get-all-returns', getAllReturnsForAdmin);

// get single return
router.get('/get-return/:returnId', getSingleReturn);







export default router;



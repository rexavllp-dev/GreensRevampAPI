import express from 'express';
import { adminUserRegister,  approveCompanyByAdmin, isActiveByAdmin, isNotActiveByAdmin,  rejectCompanyByAdmin } from '../controllers/adminController.js';
import {  updateAndApproveOrRejectBulkOrders } from '../controllers/bulkController.js';
import { AddPrivacyPolicy, deletePrivacyPolicyById, getALLPrivacyPolicy, updatePrivacyPolicyById } from '../controllers/PrivacyPoliciesController.js';
import { getAllReturnsForAdmin, getSingleReturn, updateReturnStatus } from '../controllers/returnController.js';
import { getAllReplacementsForAdmin, getSingleReplacement, updateReplacementStatus } from '../controllers/replaceController.js';
import { createBanner } from '../controllers/homePageBannerController.js';


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


// privacy policy routes

// create privacy policy
router.post('/create-privacy-policy', AddPrivacyPolicy);

// get privacy policy
router.get('/get-privacy-policy', getALLPrivacyPolicy);

// update privacy policy
router.put('/update-privacy-policy/:id', updatePrivacyPolicyById);

// delete privacy policy
router.delete('/delete-privacy-policy/:id', deletePrivacyPolicyById);

// admin return

// update return status
router.put('/return/update-status/:returnId', updateReturnStatus);

// get all returns for admin
router.get('/return/get-all-returns', getAllReturnsForAdmin);

// get single return
router.get('/return/get-return/:returnId', getSingleReturn);



// update replacement status
router.put('/replacement/update-status/:replacementId', updateReplacementStatus);                                                                             

// get single replacement for admin
router.get('/replacement/get-replacement/:replacementId', getSingleReplacement);

// get all replacements for admin
router.get('/replacement/get-all-replacements', getAllReplacementsForAdmin);



// Home page banner routes
// create banner
router.post('/banner/create_banner', createBanner);

// // update banner
// router.put('/banner/update_banner/:bannerId', updateBanner);



export default router;



import express from 'express';
import { createCancelReasons, deleteCancelReasons, getCancelReason, getCancelReasonByIds, updateCancelReasons } from '../controllers/cancelReasonsController.js';




const router = express.Router();


// create cancel reasons
router.post('/create-cancel-reason',  createCancelReasons);

// update cancel reasons
router.put('/update-cancel-reason/:id', updateCancelReasons);

// get cancel reasons by id
router.get('/get-cancel-reason/:id', getCancelReasonByIds);

// get all cancel reasons
router.get('/get-cancel-reasons', getCancelReason);

// delete cancel reasons
router.delete('/delete-cancel-reason', deleteCancelReasons);





export default router;
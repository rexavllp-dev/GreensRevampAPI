import express from 'express';
import { handlePaymentRequest } from '../controllers/paymentController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// create address
router.post('/pay_request', handlePaymentRequest);


export default router;

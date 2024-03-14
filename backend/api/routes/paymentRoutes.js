import express from 'express';
import { getAllTransactions, handlePaymentRequest , handlePaymentRequestCompletion } from '../controllers/paymentController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// create address
router.post('/pay_request', handlePaymentRequest);

router.post('/pay_complete', handlePaymentRequestCompletion);

router.get('/transactions', getAllTransactions);


export default router;

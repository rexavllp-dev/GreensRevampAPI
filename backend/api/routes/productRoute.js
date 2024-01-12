import express from 'express';
import { createPrice } from '../controllers/priceController.js';

const router = express.Router();

// price routes

// create price route
router.post('/create-price', createPrice);


export default router;
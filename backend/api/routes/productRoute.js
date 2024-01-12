import express from 'express';
import { createPrice } from '../controllers/priceController.js';
import { createAProduct } from '../models/productModel.js';

const router = express.Router();

// price routes

// create price route
router.post('/create-price', createPrice);
router.post('/create-product', createAProduct);


export default router;
import express from 'express';
import { createPrice } from '../controllers/priceController.js';
import { createProduct } from '../controllers/productController.js';

const router = express.Router();

// price routes

// create price route
router.post('/create-price', createPrice);
router.post('/create-product', createProduct);


export default router;
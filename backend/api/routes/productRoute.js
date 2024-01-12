import express from 'express';
import { createProduct } from '../controllers/productController.js';
import { createPrice, updatePrice } from '../controllers/priceController.js';

const router = express.Router();

// price routes

// create price route
router.post('/create-price', createPrice);
router.post('/create-product', createProduct);
// update price
router.put('/update-price', updatePrice);
// get a price



export default router;
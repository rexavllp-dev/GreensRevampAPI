import express from 'express';
import { createPrice } from '../controllers/priceController.js';
import { createProduct, updateProduct } from '../controllers/productController.js';

const router = express.Router();



// create a product
router.post('/create-product', createProduct);
// upadte a product
router.put('/update-product/:productId', updateProduct)
// create price route
router.post('/create-price', createPrice);



export default router;
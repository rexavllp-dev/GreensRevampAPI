import express from 'express';
import { createProduct, getAllProduct, getSingleProduct, updateProduct } from '../controllers/productController.js';
import { createPrice, updatePrice } from '../controllers/priceController.js';


const router = express.Router();



// create a product
router.post('/create-product', createProduct);

// upadte a product
router.put('/update-product/:productId', updateProduct)

// get a product
router.get('/get-product/:productId', getSingleProduct)

// get all products.

router.get('/get-products', getAllProduct)

// create price route
router.post('/create-price', createPrice);

router.post('/create-product', createProduct);

// update price
router.put('/update-price', updatePrice);

// get a price



export default router;
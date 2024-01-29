import express from 'express';
import { addProductToCart, getProductFromCart, removeProductFromCart, updateProductCartQuantity } from '../controllers/cartController.js';


const router = express.Router();

// add product to the session cart and save it in the session

router.post('/add-to-cart', addProductToCart);

// update cart quantity

router.put('/update-cart-quantity', updateProductCartQuantity);

// get cart

router.get('/get-cart', getProductFromCart);

// delete item from cart

 router.delete('/delete-cart-item/:productId', removeProductFromCart);


export default router;

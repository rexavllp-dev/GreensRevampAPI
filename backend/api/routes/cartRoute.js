import express from 'express';
import { addProductToCart, getProductFromCart, removeProductFromCart, updateFlags, updateProductCartQuantity } from '../controllers/cartController.js';
import { createDeliveryEstimate, getSingleDeliveryEstimate, getsAllDeliveryEstimate, updateDeliveryEstimate } from '../controllers/deliveryEstimateController.js';
import { createRegion, getSingleRegion, getsAllRegion, updateRegion } from '../controllers/regionController.js'
import priceVerificationMiddleware from '../middleware/productStockPriceMiddleware.js';
import verifyProductPrice from '../middleware/verifyProductPrice.js';



const router = express.Router();

// add product to the session cart and save it in the session

router.post('/add-to-cart', addProductToCart);

// update cart quantity

router.put('/update-cart-quantity', updateProductCartQuantity);

// get cart

router.get('/get-cart', getProductFromCart);

// delete item from cart

router.delete('/delete-cart-item/:productId', removeProductFromCart);

//  update flags

router.put('/update-flags', updateFlags);

//test router

router.get('/checkout', verifyProductPrice, (req, res) => {
    res.json({ message: 'Hello from Express!' })
})





//  _________________________________________________________________________________________________________________________________________________

//  estimate delivery

// create estimate delivery
router.post('/create-estimate-delivery', createDeliveryEstimate);

// update estimate delivery
router.put('/update-estimate-delivery/:deliveryEstimateId', updateDeliveryEstimate);

// get single estimate delivery
router.get('/get-estimate-delivery/:deliveryEstimateId', getSingleDeliveryEstimate);

// get all estimate delivery
router.get('/get-all-estimate-delivery', getsAllDeliveryEstimate);


//  _________________________________________________________________________________________________________________________________________________

//  Regions


// create Region
router.post('/create-region', createRegion);

// update Region
router.put('/update-region/:regionId', updateRegion);

// get Region
router.get('/get-region/:regionId', getSingleRegion);

// get all Regions
router.get('/get-all-regions', getsAllRegion);


export default router;

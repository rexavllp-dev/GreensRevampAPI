
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { createWishlist, getAllWishlistProduct, removedWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

// create save for later

router.post('/create-wishlist', verifyToken , createWishlist);

// get all save for later 

router.get('/get-all-wishlist', getAllWishlistProduct);

// remove save for later

router.delete('/remove-wishlist/:wishlistId', removedWishlist);


export default router;
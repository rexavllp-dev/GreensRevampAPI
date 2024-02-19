import express from 'express';
import { createSaveForLater, getAllSaveForLaterProduct, removedSaveForLater } from '../controllers/saveForLaterController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// create save for later
router.post('/create-save-for-later', verifyToken , createSaveForLater);

// get all save for later 
router.get('/get-all-save-for-later',verifyToken, getAllSaveForLaterProduct);

// remove save for later
router.delete('/remove-save-for-later/:saveForLaterId', removedSaveForLater); 


export default router;
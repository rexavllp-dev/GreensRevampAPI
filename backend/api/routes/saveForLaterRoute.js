import express from 'express';
import { createSaveForLater, getAllSaveForLaterProduct } from '../controllers/saveForLaterController.js';

const router = express.Router();

// create save for later
router.post('/create-save-for-later', createSaveForLater);

// get all save for later 
router.get('/get-all-save-for-later', getAllSaveForLaterProduct);

export default router;
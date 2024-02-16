import express from 'express';
import { createSaveForLater } from '../controllers/saveForLaterController.js';

const router = express.Router();


router.post('/create-save-for-later', createSaveForLater);


export default router;
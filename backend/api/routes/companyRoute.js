import express from 'express';
import { registerCompany } from '../controllers/companyController.js';
import { uploadAndResizeImage } from '../controllers/imageController.js';
import { uploadFiles } from '../middleware/uploadFiles.js';





// company routes

const router = express.Router();

// register  routes
router.post('/', registerCompany);

// upload image
router.post('/upload', uploadFiles({ key: 'image', name: 'image', formatType: 'image' }), uploadAndResizeImage);


export default router;
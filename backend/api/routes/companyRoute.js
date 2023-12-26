import express from 'express';
import { registerCompany } from '../controllers/companyController.js';
import { upload } from '../middleware/multerMiddleware.js';




// company routes

const router = express.Router();

// register  routes
router.post('/', registerCompany);

// upload image
router.post('/upload', upload.array('photos', 3), function(req, res, next) {
    res.send('Successfully uploaded ' + req.files.length + ' files!')
  })


export default router;
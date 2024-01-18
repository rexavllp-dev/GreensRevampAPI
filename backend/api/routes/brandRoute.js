import express from 'express';
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand, uploadBrandImages } from '../controllers/brandController.js';

const router = express.Router();

// create a brand
router.post('/create-brand', createBrand);

// upload brand logo and brand banner
router.post('/upload-brand-images', uploadBrandImages);

// update a product
router.put('/update-brand/:brandId', updateBrand);

// get a product
router.get('/get-brand/:brandId', getSingleBrand)

// delete a product
router.delete('/delete-brand/:brandId', deleteBrand);

// get all brands.
router.get('/get-brands', getAllBrands)



export default router;
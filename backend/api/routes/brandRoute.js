import express from 'express';
import { createBrand, deleteBrand, deleteBrandImage, getAllBrands, getSingleBrand, updateBrand, uploadBrandImages } from '../controllers/brandController.js';
import { addSeo, deleteSeo, getAllSeo, getSingleSeo, updateSeo } from '../controllers/brandSeoController.js';

const router = express.Router();

// create a brand
router.post('/create-brand', createBrand);

// upload brand logo and brand banner
router.post('/upload-brand-images/:brandId', uploadBrandImages);

// delete brand image
router.delete('/delete-brand-image/:imageId', deleteBrandImage);

// update a product
router.put('/update-brand/:brandId', updateBrand);

// get a product
router.get('/get-brand/:brandId', getSingleBrand)

// delete a product
router.delete('/delete-brand/:brandId', deleteBrand);

// get all brands.
router.get('/get-brands', getAllBrands);



// seo routes

// create seo
router.post('/create-seo', addSeo);

// update a product
router.put('/update-seo/:seoId', updateSeo);

// get a price
router.get('/get-seo/:seoId', getSingleSeo);

// get all seo
router.get('/getall-seo', getAllSeo);

// delete seo 
router.delete('/delete-seo/:seoId', deleteSeo);



export default router;
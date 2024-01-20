import express from 'express';
import { addProductImages, createProduct, deleteProduct, getAllProduct, getProductsWithSorting, getSingleProduct, updateProduct } from '../controllers/productController.js';
import { createPrice, deletePrice, getAllPrice, getPrice, updatePrice } from '../controllers/priceController.js';
import { addSeo, deleteSeo, getAllSeo, getSingleSeo, updateSeo } from '../controllers/productSeoController.js';
import { createProductInventory, updateProductInventory } from '../controllers/inventoryController.js';
import { createProductBadge } from '../controllers/badgeController.js';
import { createRelatedProduct } from '../controllers/relatedProductController.js';
import { addProductReview, approveReviewByAdmin, getAllReviews } from '../controllers/reviewsController.js';
import { getPublicProducts } from '../models/publicProductModel.js';
import { getAllProductPublic } from '../controllers/publicProductCrotroller.js';


const router = express.Router();



// create a product
router.post('/create-product', createProduct);

// update a product
router.put('/update-product/:productId', updateProduct)

// get a product
router.get('/get-product/:productId', getSingleProduct)

// delete a product
router.delete('/delete-product/:productId', deleteProduct);

// get all products.

router.get('/get-products', getAllProduct)

// products public routes 

router.get('/public/getall-products',getAllProductPublic); 

// __________________________________________________________________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________________________________________________________________

// create price route
router.post('/create-price', createPrice);

// update price
router.put('/update-price/:productId', updatePrice);

// get all price
router.get('/getall-price', getAllPrice)

// get a price
router.get('/get-price/:priceId', getPrice)

// delete a price
router.delete('/delete-price/:priceId', deletePrice);

// upload images
router.post('/images/:productId', addProductImages);

// sort products
router.get('/sort-products', getProductsWithSorting);



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


//_____________________________________________________________________________________________________________________________________________________________________________

// inventory routes

router.post('/create-inventory', createProductInventory);

// update inventory 

router.put('/update-inventory/:productId', updateProductInventory);

// product badege route

router.post('/create-badge', createProductBadge);

// related products

router.post('/create-related-product/:product_id', createRelatedProduct);


// reviews routes

router.post('/create-review', addProductReview);

// approve review by admin 
router.put('/approve-review', approveReviewByAdmin);


// get all reviews 
router.get('/get-reviews', getAllReviews);



export default router;
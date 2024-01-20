import express from 'express';
import { addProductImages, createProduct, deleteProduct, getAllProduct, getProductsWithSorting, getSingleProduct, updateProduct } from '../controllers/productController.js';
import { createPrice, deletePrice, getAllPrice, getPrice, updatePrice } from '../controllers/priceController.js';
import { addSeo, deleteSeo, getAllSeo, getSingleSeo, updateSeo } from '../controllers/productSeoController.js';
import { createProductInventory, updateProductInventory } from '../controllers/inventoryController.js';
import { createProductBadge } from '../controllers/badgeController.js';
import { createNewOption, deleteOption, getAllOptions, getSingleOption } from '../controllers/optionController.js';


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

// create inventory
router.post('/create-inventory', createProductInventory);
// update inventory 
router.put('/update-inventory/:productId', updateProductInventory);


// product badge route
router.post('/create-badge', createProductBadge);

// option route

// create option
router.post('/create-option', createNewOption);

// get option
router.get('/get-option/:optionId', getSingleOption);

// get all options
router.get('/get-all-options', getAllOptions);

// delete option
router.delete('/delete-option/:optionId', deleteOption);


export default router;
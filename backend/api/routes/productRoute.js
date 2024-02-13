import express from 'express';
import { addProductImages, createProduct, deleteProduct, deleteProductImage, getAllOptionProducts, getAllProduct, getProductsOfCategory, getProductsWithSorting, getSingleProduct, updateProduct } from '../controllers/productController.js';
import { createPrice, deletePrice, getAllPrice, getPrice, updatePrice } from '../controllers/priceController.js';
import { addSeo, deleteSeo, getAllSeo, getSingleSeo, updateSeo } from '../controllers/productSeoController.js';
import {  createProductInventory,  modifyStock,  updateProductInventory } from '../controllers/inventoryController.js';
import { createProductBadge } from '../controllers/badgeController.js';
import { createRelatedProduct, deleteRelatedProduct, getRelatedProductsWithProductId } from '../controllers/relatedProductController.js';
import { addProductReview, approveReviewByAdmin, getAllReviews } from '../controllers/reviewsController.js';
import { getAllProductPublic, getAllRelatedProductPublicByProductId, getSingleProductPublic } from '../controllers/publicProductController.js';
import { createNewOption, deleteOption, getAllOptions, getOptionsByProductId } from '../controllers/optionController.js';
import { addProductOptionValues, deleteOptionLabel, getOptionsValues, updateAOptionLabel  } from '../controllers/productOptionController.js';
import { createProductLanguage,  deleteLanguage, getAllProductLanguages, updateProductLanguage } from '../controllers/productLanguageController.js';
import { getStockHistoryByProduct } from '../controllers/stockHistoryController.js';
import { addProductVariantValues, deleteVariantLabel, getVariantsValues, getVariantsWithProductId, updateAVariantLabel } from '../controllers/productVariantsController.js';
import { createNewSearchHistory, getAllSearchHistory } from '../controllers/searchHistoryController.js';
import { createABulk, createBulkAboveMaxOrders, deleteABulk, getBulkOrderRequestsHandler, getBulkWithProductId, getPriceByProductId, getSingleBulk, getSingleBulkAboveMaxOrder, getsAllBulks, submitBulkOrderRequest, updateABulk } from '../controllers/bulkController.js';
import verifyToken from '../middleware/verifyToken.js';





const router = express.Router();


// create a product
router.post('/create-product', createProduct);

// update a product
router.put('/update-product/:productId', updateProduct)

// get a product
router.get('/get-product/:productId', getSingleProduct)

// delete a product
router.delete('/delete-product', deleteProduct);

// get all products.

router.get('/get-products', getAllProduct);

router.get('/get-all-option-products', getAllOptionProducts);

// _________________________________________________________________________________________________________________

// products public routes 
router.get('/public/getall-products',getAllProductPublic); 

// get a single products public
router.get('/public/get-product/:productId', getSingleProductPublic);

// get all related products public
router.get('/public/get-related-products/:productId', getAllRelatedProductPublicByProductId);



// _________________________________________________________________________________________________________________


// get product by category
router.get('/get-products-category/:categoryId', getProductsOfCategory);

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

// delete image
router.delete('/delete-product-image/:imageId', deleteProductImage);

// sort products
router.get('/sort-products', getProductsWithSorting);

// ___________________________________________________________________________________________

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
// add stock and reduce stock
router.post('/modify-stock/:productId', modifyStock);



// _______________________________________________________________________________________________________________________

// product badge route
router.post('/create-badge', createProductBadge);

// _____________________________________________________________________________________________

// related products
// create related product
router.post('/create-related-product/:product_id', createRelatedProduct);

// get related products by product id
router.get('/get-related-products/:productId', getRelatedProductsWithProductId);

// ______________________________________________________________________________________________
// delete related product
router.delete('/delete-related-product', deleteRelatedProduct);

// reviews routes

router.post('/create-review', addProductReview);

// approve review by admin 
router.put('/approve-review', approveReviewByAdmin);


// get all reviews 
router.get('/get-reviews', getAllReviews);
// __________________________________________________________________________________________________
// option route

//get all options
router.get('/get-options/:productId', getAllOptions);

// create option
router.post('/create-option', createNewOption);

// get option by product id
router.get('/get-options/:productId', getOptionsByProductId);

// delete option
router.delete('/delete-option/:optionId', deleteOption);

//______________________________________________________________________________________________________________________________________________________________ 

// product option route

// create product option
router.post('/create-product-option', addProductOptionValues);

// get Options values by option id
router.get('/get-option-values/:optionId', getOptionsValues);


// update product option
router.put('/update-product-option', updateAOptionLabel);

// update all option label


// delete product option
router.delete('/delete-product-option/:product_optionId', deleteOptionLabel);
// __________________________________________________________________________________________


// variants routes

// product variants route

// create product variant
router.post('/create-product-variant', addProductVariantValues);

// get variants values by variant id
router.get('/get-variant-values/:variantId', getVariantsValues);

router.get('/get-variants-by-product/:productId', getVariantsWithProductId);


// update product variant
router.put('/update-product-variant/:product_variantId', updateAVariantLabel);

// delete product variant
router.delete('/delete-product-variant/:productVariantId', deleteVariantLabel);

// __________________________________________________________________________________________

// product language route
router.post('/create-product-language', createProductLanguage);
// update product language
router.put('/update-product-language/:languageId', updateProductLanguage);
// get all languages
router.get('/get-product-languages', getAllProductLanguages);
// delete language
router.delete('/delete-product-language/:languageId', deleteLanguage);

// _________________________________________________________________________________________________

// stock history route

// get all stock history by product
router.get('/stock-history-by-product/:product_id', getStockHistoryByProduct);  


// search history route
router.post('/create-search', createNewSearchHistory);

// get all search
router.get('/get-all-search', getAllSearchHistory);


// products bulk route

// create a bulk
router.post('/create-bulk', createABulk);
// update a bulk
router.put('/update-bulk/:bulkId', updateABulk);
// get a bulk
router.get('/get-bulk/:bulkId', getSingleBulk);
// get all bulk
router.get('/get-all-bulk', getsAllBulks);
// get bulk with product id
router.get('/get-bulk-product/:productId', getBulkWithProductId);
// delete bulk
router.delete('/delete-bulk/:bulkId', deleteABulk);

// get price by product id 
router.get('/get-price-by-product/:productId', getPriceByProductId);


// bulk above route

// create a bulk above
router.post('/create-bulk-above-max-orders', createBulkAboveMaxOrders);

// get a bulk above
router.get('/get-bulk-above/:bulkId', getSingleBulkAboveMaxOrder);

// submit user bulk request
router.post('/submit-bulk-request', verifyToken, submitBulkOrderRequest);
// get all bulk request
router.get('/get-all-bulk-request', getBulkOrderRequestsHandler);

// update bulk above max orders


export default router;


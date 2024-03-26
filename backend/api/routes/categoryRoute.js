import express from 'express';
import { createCategory, deleteCategory, deleteCategoryImage, getAllCategories, getCategoriesByTree, getCategoriesWithParentId, getSingleCategory, updateCategory, uploadCategoryImages, getMainTree, getAllCategoriesByCatUrl } from '../controllers/categoryController.js';


const router = express.Router();

// create a Category
router.post('/create-category', createCategory);

// upload Category logo and Category banner
router.post('/upload-category-images/:categoryId', uploadCategoryImages);

// delete brand image
router.post('/delete-category-image/:categoryId', deleteCategoryImage);

// update a product
router.put('/update-category/:categoryId', updateCategory);

// get product by parent id
router.get('/get-categories-parent-id/:parentId', getCategoriesWithParentId)

// get a product
router.get('/get-category/:categoryId', getSingleCategory)

// delete a product
router.delete('/delete-category/:categoryId', deleteCategory);

// get all Categories.
router.get('/get-categories', getAllCategories)

// get categories tree
router.get('/get-categories-tree', getCategoriesByTree);

router.get('/get-main-tree', getMainTree);

// get categories with cat url
router.get('/get-sub-categories/:catUrl', getAllCategoriesByCatUrl);





export default router;

import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoriesWithParentId, getSingleCategory, updateCategory, uploadCategoryImages } from '../controllers/categoryController.js';


const router = express.Router();

// create a Category
router.post('/create-category', createCategory);

// upload Category logo and Category banner
router.post('/upload-category-images', uploadCategoryImages);

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



export default router;

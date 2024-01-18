import db from '../../config/dbConfig.js';


// create category 
export const createACategory = async (categoryData) => {
    const category = await db('categories').insert(categoryData).returning('*');
    return category;
};

// update a category
export const updateACategory = async (categoryId, updatedData) => {
    const updatedCategory = await db('categories').where({ id: categoryId })
        .update(updatedData)
        .returning('*'); // Return the updated product
    return updatedCategory;
};

// get single category
export const getCategoryById = async (categoryId) => {
    const category = await db('categories').select('*').where({ id: categoryId }).first();
    return category;
};

// get all categories
export const getCategories = async () => {
    const categories = await db('categories').select('*');
    return categories;
};

export const getCategoriesByParentId = async (parentId) => {
    const categories = await db('categories').select('*').where({ cat_parent_id: parentId });
    return categories;
}

// delete categories
export const deleteACategory = async (categoryId) => {
    const deleteCategory = db('categories').where({ id: categoryId }).del();
    return deleteCategory;
};

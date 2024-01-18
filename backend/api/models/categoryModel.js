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


export const getCategoriesTree = async () => {
    console.log('Before query');
    const categories = await db('categories').select('id', 'cat_parent_id', 'cat_name').orderBy('id');
    // console.log(categories);
    const categoryMap = {};
    const rootCategories = [];

    categories.forEach((category) => {
        // console.log(category);
        category.children = [];
        categoryMap[category.id] = category;
        const parent = categoryMap[category.cat_parent_id];
        if (parent) {
            // console.log(parent);
            parent.children.push(category);
        } else {
            rootCategories.push(category);
            // console.log(category);
        }
    });

    return rootCategories;
}
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
};

// delete categories
export const deleteACategory = async (categoryId) => {
  const deleteCategory = db('categories').where({ id: categoryId }).del();
  return deleteCategory;
};


export const getCategoriesTree = async () => {

  try {
    const categories = await db.select('*').from('categories').orderBy('cat_name', 'asc');
    return buildTree(categories);
  } catch (error) {
    throw error;
  }
};

function buildTree(categories, parentId = 0) {
  let node = [];
  categories
    .filter(category => category.cat_parent_id === parentId)
    .forEach(category => {
      node.push({
        id: category.id,
        name: category.cat_name,
        description: category.cat_description,
        category_status: category.category_status,
        cat_banner: category.cat_banner,
        cat_logo: category.cat_logo,
        children: buildTree(categories, category.id)
      });
    });

  return node;
}


export const getMainCategoriesByTree = async () => {

  try {
    const categories = await db.select('*').from('categories').orderBy('cat_name', 'asc');
    return buildMainTree(categories);
  } catch (error) {
    throw error;
  }
};


function buildMainTree(categories, parentId = 0) {

  let node = [];
  categories
    .filter(category => category.cat_parent_id === parentId)
    .forEach(category => {
      node.push({
        id: category.id,
        title: category.cat_name,
        icon: category.cat_logo,
        isIcon: false,
        isActive: false,
        link: '/ingredients',
        children: buildMainTree(categories, category.id)
      });
    });

  return node;
}




// delete image

export const deleteCategoryImageById = async (categoryId, type) => {

  if (type == 'cat_logo') {
    const deletedImage = await db('categories')
      .where({ id: categoryId })
      .update({ cat_logo: null });
    return deletedImage;
  }

  if (type == 'cat_banner') {
    const deletedImage = await db('categories')
      .where({ id: categoryId })
      .update({ cat_banner: null });
    return deletedImage;
  }


};




export const getCategoryIdWithCatUrl = async (catUrl) => {

  const category = await db('categories')
    .select('*').
    where({ cat_url: catUrl })
    .first();

  return category;

};
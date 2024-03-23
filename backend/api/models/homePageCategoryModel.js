import db from '../../config/dbConfig.js';


export const createAHomePageCategory = async (data) => {

    const homePageCategory = await db('homepage_category')
        .insert(data)
        .returning('*')
    return homePageCategory;
};


export const getAHomePageCategory = async (homepageCategoryId) => {

    const homePageCategory = await db('homepage_category')
        .where({ homepage_category_id: homepageCategoryId })
        .select('*')

    return homePageCategory;
};



export const getsAllHomePageCategories = async () => {

    const homePageCategories = await db('homepage_category')
        .select('*')

    return homePageCategories;

};



export const deleteAHomePageCategory = async (homepageCategoryId) => {

    const deletedProduct = await db('homepage_category')

        .where({ homepage_category_id: homepageCategoryId })

    return deletedProduct;
};



// export const deleteAHomePageCategory = async (homepageCategoryId) => {

//     const homePageCategory = await db('homepage_category')
//         .where({ homepage_category_id: homepageCategoryId })
//         .del()

//     return homePageCategory;
// };
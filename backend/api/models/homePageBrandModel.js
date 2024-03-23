import db from '../../config/dbConfig.js';


export const createAHomePageBrand = async (data) => {

    const homePageBrand = await db('homepage_brand')
        .insert(data)
        .returning('*')
    return homePageBrand;
};


export const getAHomePageBrand = async (homepageBrandId) => {

    const homePageBrand = await db('homepage_brand')
        .where({ homepage_brand_id: homepageBrandId })
        .select('*')

    return homePageBrand;
};



export const getsAllHomePageBrands = async () => {

    const homePageBrands = await db('homepage_brand')
        .select('*')

    return homePageBrands;

};



export const deleteAHomePageBrand = async (homepageBrandId) => {

    const homePageBrand = await db('homepage_brand')
        .where({ homepage_brand_id: homepageBrandId })


    return homePageBrand;
};
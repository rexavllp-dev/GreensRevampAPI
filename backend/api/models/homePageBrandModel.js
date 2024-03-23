import db from '../../config/dbConfig.js';


export const createAHomePageBrand = async (data) => {

    const homePageBrand = await db('homepage_brand')
        .insert(data)
        .returning('*')
    return homePageBrand;
};


export const getAHomePageBrand = async (homepageBrandId) => {

    const homePageBrand = await db('homepage_brand')

        .leftJoin('brands', 'homepage_brand.homepage_brand_id', 'brands.id')

        .where({ homepage_brand_id: homepageBrandId })
        .select('*')

    return homePageBrand;
};



export const getsAllHomePageBrands = async () => {

    const homePageBrands = await db('homepage_brand')

        .leftJoin('brands', 'homepage_brand.brand_id', 'brands.id')

        .select('*')

    return homePageBrands;

};



export const deleteAHomePageBrand = async (homepageBrandId) => {

    const homePageBrand = await db('homepage_brand')
        .where({ homepage_brand_id: homepageBrandId })
        .del();


    return homePageBrand;
};
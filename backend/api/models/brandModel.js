import db from '../../config/dbConfig.js';


// create brand 
export const createABrand = async (brandData) => {
    const brand = await db('brands').insert(brandData).returning('*');
    return brand;
};

// update a brand
export const updateABrand = async (brandId, updatedData) => {
    const updatedBrand = await db('brands').where({ id: brandId })
        .update(updatedData)
        .returning('*'); // Return the updated product
    return updatedBrand;
};

// get single brand
export const getBrandById = async (brandId) => {
    const brand = await db('brands').select('*').where({ id: brandId }).first();
    return brand;
};

// get all brands
export const getBrands = async () => {
    const brands = await db('brands')
    .leftJoin('brand_seo', 'brands.id', 'brand_seo.brand_id')
    .select(
        'brands.*',
        'brand_seo.*',
        'brand_seo.id as brand_seo_id',
        );
    return brands;
};

// delete brands
export const deleteABrand = async (brandId) => {
    const deleteBrand = db('brands').where({ id: brandId }).del();
    return deleteBrand;
};


export const deleteBrandImageById = async (brandId) => {
    const deletedImage = await db('brands')
    .where({ id: brandId })
    .update({ brd_banner: null, brd_logo: null });
    return deletedImage;
};



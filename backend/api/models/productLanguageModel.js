import db from "../../config/dbConfig.js";

export const createANewProductLanguage = async (productLanguageData) => {
    const newProductLanguage = await db("product_languages").insert(productLanguageData).returning("*");
    return newProductLanguage;
};


// update a brand
export const updateALanguage = async (languageId, updatedData) => {
    const updated = await db('product_languages').where({ id: languageId })
        .update(updatedData)
        .returning('*'); // Return the updated product
    return updated;
};

// get all languages
export const getLanguages = async () => {
    const languages = await db('product_languages').select('*');
    return languages;
}

// delete a language
export const deleteALanguage = async (languageId) => {
    const deleteLanguage = db('product_languages').where({ id: languageId }).del();
    return deleteLanguage;
}
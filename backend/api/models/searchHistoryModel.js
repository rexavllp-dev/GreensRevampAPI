import db from '../../config/dbConfig.js';


// create search history
export const createSearchHistory = async (searchData) => {
    console.log(searchData);
    const newSearch = await db("search_history").insert(searchData).returning('*');
    console.log(newSearch);
    return newSearch;
};

export const getAllSearch = async () => {
    const searchHistory = await db("search_history").select('*');
    return searchHistory;
};
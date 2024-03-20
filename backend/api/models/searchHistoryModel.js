import db from '../../config/dbConfig.js';
import { getAllProducts, getsAllRecommendedProducts } from './productModel.js';


// create search history
export const saveSearchHistory = async (userId, searchKeyword, resultsCount) => {

    const newSearchHistory = await db('search_history')
        .insert({

            user_id: userId,
            search_keyword: searchKeyword,
            results: resultsCount,
            searched_at: db.fn.now(),

        })
        .returning('*');

    return newSearchHistory;
};


export const getUserRecommendedProducts = async (userId) => {

    const mostRecentSearch = await db('search_history')
        .where('user_id', userId)
        .orderBy('searched_at', 'desc')
        .first(); 


    if (!mostRecentSearch) {
       
        return [];
    };

    const mostRecentKeyword = mostRecentSearch.search_keyword;

    console.log(mostRecentKeyword);


    // Retrieve recommended products based on the most recent search keyword
    const recommendedProducts = await getsAllRecommendedProducts(userId, mostRecentKeyword);


    return recommendedProducts.products;

};



export const getAllSearch = async () => {
    const searchHistory = await db("search_history").select('*');
    return searchHistory;
};



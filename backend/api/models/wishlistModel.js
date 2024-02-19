import db from '../../config/dbConfig.js';
// create wishlist
export const addWishlist = async (wishlistData) => {
    const wishlist = await db('wishlist').insert(wishlistData).returning('*');
    return wishlist;
}

// get user ID wishlist
export const getUserWishlist = async (userId) => {
    const wishlistData = await db('wishlist')
    .where({ user_id: userId })
    .select('*')
    .first();
    return wishlistData;

}

// get all wishlist
export const getAllWishlist = async () => {
    const allWishlist = await db('wishlist').select('*');
    return allWishlist;
}


// remove wishlist
export const removeWishlist = async (wishlistId) => {
    const removedWishlist = await db('wishlist').where({ id: wishlistId }).del();
    return removedWishlist;
}


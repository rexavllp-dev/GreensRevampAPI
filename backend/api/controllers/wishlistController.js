import { addWishlist, getAllWishlist, getUserWishlist, removeWishlist } from "../models/wishlistModel.js";


// create wishlist
export const createWishlist = async (req, res) => {

    const wishlistData = req.body;
    const userId = req.user.userId;

    try {

        const userWishlist = await getUserWishlist(userId);

        if (userWishlist) {
            
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Product in your Wishlist already exists'
            })
        }

        const newWishlist = await addWishlist(userId, wishlistData);

        res.status(200).json({
            status: 200,
            success: true,
            result: newWishlist,
            message: 'Wishlist added successfully'
        })

    } catch (error) {

        console.error(error);
        
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to add wishlist. Please try again later.'
        })
    }
}


// get all wishlist

export const getAllWishlistProduct = async (req, res) => {

    const userId = req.user.userId;
    
    try {
        
        const allWishlist = await getAllWishlist(userId);

        res.status(200).json({
            status: 200,
            success: true,
            result: allWishlist,
            message: 'All wishlist products'
        })

    } catch (error) {
        console.log(error)
        
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to get wishlist. Please try again later.'
        })
    }
}

// remove wishlist

export const removedWishlist = async (req, res) => {

    const wishlistId = req.params.wishlistId;

    try {

        const removedWishlist = await removeWishlist(wishlistId);

        res.status(200).json({
            status: 200,
            success: true,
            result: removedWishlist,
            message: 'Wishlist removed successfully'
        })

    } catch (error) {

        res.status(500).json({

            status: 500,
            success: false,
            error: error,
            message: 'Failed to remove wishlist. Please try again later.'
        })
    }
}

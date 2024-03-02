import { createNotifyProduct, getAllNotifyProducts, getNotifyProducts, removeNotifyProduct } from "../models/notifyProductModel.js";

// notify product
export const notifyProduct = async (req, res) => {
    
    const  notifyProductData  = req.body;
    const userId = req.user.userId;

    try {

        const userNotifyProduct = await getNotifyProducts(userId);
        
        const notifyProduct = await createNotifyProduct(userId, notifyProductData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Product notified successfully",
            result: notifyProduct
        })

    }  catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to notify product",
        })
    }
}

// get notify product

export const getNotifyProduct = async (req, res) => {

    const userId = req.user.userId;

    try {

        const notifyProduct = await getAllNotifyProducts(userId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Notify product fetched successfully",
            result: notifyProduct
        })

    }  catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get notify product",
        })
    }

}


export const removeNotifiedProduct = async (req, res) => {
    
    const notifyProductId = req.params.notifyProductId;

    try {
        
        const removedNotifyProduct = await removeNotifyProduct(notifyProductId);

        res.status(200).json({
            status: 200,
            success: true,
            result: removedNotifyProduct,
            message: 'Notify product removed successfully'
        })

    } catch (error) {
        
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to remove notify product. Please try again later.'
        })
    }
}
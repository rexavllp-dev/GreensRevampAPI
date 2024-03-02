import { createNotifyProduct } from "../models/notifyProductModel.js";

// notify product
export const notifyProduct = async (req, res) => {
    
    const { product_id, user_id } = req.body;

    try {
        
        const notifyProduct = await createNotifyProduct(product_id, user_id);

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

    try {

        const notifyProduct = await getNotifyProducts();

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
import { addRelatedProduct } from "../models/relatedProductModel.js";

// creates related products

export const createRelatedProduct = async (req, res) => {
    
    const { product_id } = req.params;
    const {relatedProductData} = req.body;
    console.log(relatedProductData)

    try {



        if(!relatedProductData) {

            return res.status(400).json({
                status: 400,
                success: false,
                message: "Related product data is required",
            });
        }

        // map the ids
        const data = relatedProductData.map((relatedProduct) => {

            return {
                product_id: product_id,
                related_product_id: relatedProduct.id,
            }
        })

        const relatedProduct = await addRelatedProduct(data);
        res.status(201).json({
            status: 201,
            success: true,
            message: "Related product created successfully",
            result: relatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create related product, something went wrong",
            error
        });
    }
}


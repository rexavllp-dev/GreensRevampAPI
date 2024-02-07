import { addRelatedProduct, deleteARelatedProduct, getRelatedProductsByProductId } from "../models/relatedProductModel.js";

// creates related products

export const createRelatedProduct = async (req, res) => {
    const { product_id } = req.params;
    const { relatedProductData } = req.body;
    console.log(relatedProductData)
    try {

        if (!relatedProductData) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Related product data is required",
            });
        }

        // Check if related product already exists
        const existingRelatedProducts = await getRelatedProductsByProductId(product_id);
        const existingRelatedProductIds = existingRelatedProducts.map(product => product.related_product_id);


        const newData = [];
        const nonExistingProductIds = [];

        //  Check each related product ID if it exists in the database
        for (const relatedProduct of relatedProductData) {
            if (!existingRelatedProductIds.includes(relatedProduct.id)) {
                if(product_id != relatedProduct.id){
                    newData.push({
                        product_id: product_id,
                        related_product_id: relatedProduct.id,
                    }); 
                }
            } else {
                nonExistingProductIds.push(relatedProduct.id);
            }
        };

        if (newData.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "All provided related products already exist",
            });
        };


        const relatedProduct = await addRelatedProduct(newData);

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
};


//     const { product_id } = req.params;
//     const { relatedProductData } = req.body;

//     try {
//         if (!relatedProductData) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 message: "Related product data is required",
//             });
//         }

//         // Check if related product already exists
//         const existingRelatedProducts = await getRelatedProductsByProductId(product_id);
//         const existingRelatedProductIds = existingRelatedProducts.map(product => product.related_product_id);

//         const newData = [];
//         const nonExistingProductIds = [];

//         // Check each related product ID if it exists in the database
//         for (const relatedProduct of relatedProductData) {
//             if (!existingRelatedProductIds.includes(relatedProduct.id)) {
//                 newData.push({
//                     product_id: product_id,
//                     related_product_id: relatedProduct.id,
//                 });
//             } else {
//                 nonExistingProductIds.push(relatedProduct.id);
//             }
//         }

//         if (newData.length === 0) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 message: "All provided related products already exist",
//                 existingProductIds: nonExistingProductIds,
//             });
//         }

//         const createdRelatedProduct = await addRelatedProduct(newData);

//         res.status(201).json({
//             status: 201,
//             success: true,
//             message: "Related product created successfully",
//             result: createdRelatedProduct
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: "Failed to create related product, something went wrong",
//             error
//         });
//     }
// };


// get related products by product id

export const getRelatedProductsWithProductId = async (req, res) => {
    const productId = req.params.productId;
    try {
        const relatedProducts = await getRelatedProductsByProductId(productId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched related products successfully",
            result: relatedProducts
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch related products",
            error: error
        });
    }
};


export const deleteRelatedProduct = async (req, res) => {
    const relatedProductIds = req.query.data;

    try {

        let relatedProducts = JSON.parse(relatedProductIds);
        let deletedProducts = []
        for (let i = 0; i < relatedProducts.length; i++) {
            let deleted = await deleteARelatedProduct(relatedProducts[i]);
            deletedProducts.push(deleted);
        };

        res.status(200).json({
            status: 200,
            success: true,
            message: "Deleted related product successfully",
            result: deletedProducts
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete related product",
            error: error
        });
    }
};
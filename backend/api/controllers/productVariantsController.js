
import { createProductVariant, deleteAVariantLabel, getAllProductVariants, getProductVariantsByIDs, getVariantValuesByVariantId, getVariantsByProductId, getVariantsFromProductVariants, updateVariantLabel } from "../models/productVariantsModel.js";



// AddProductVariantValues function
export const addProductVariantValues = async (req, res) => {

    const variantValuesData = req.body;
    console.log(variantValuesData[0].variant_id);
    console.log(variantValuesData[0].product_id);

    try {

        const product_id = variantValuesData[0].product_id;





        // Check if product variants already exist
        const existingProductVariants = await getAllProductVariants(product_id);
        const existingVariantsProductVariants = await getVariantsFromProductVariants(product_id);


        const existingProductVariantIds = existingProductVariants.map((variant) => parseInt(variant.variant_id));
        const existingVariantsOfProductVariantIds = existingVariantsProductVariants.map((variant) => parseInt(variant.product_id));

        console.log(existingVariantsOfProductVariantIds, "variant_id");


        const newData = [];
        const nonExistingVariantIds = [];

        // Check each variant ID if it exists in the database
        for (const variantValue of variantValuesData) {
            if (!existingProductVariantIds.includes(parseInt(variantValue.variant_id))) {

                if (product_id != variantValue.variant_id) {
                    newData.push({
                        product_id: product_id,
                        variant_id: variantValue.variant_id,
                    });

                    if (!existingVariantsOfProductVariantIds.includes(parseInt(variantValue.variant_id))) {
                        // Add bidirectional relationship
                        newData.push({
                            product_id: variantValue.variant_id,
                            variant_id: product_id,
                        });
                    }
                }
            } else {
                nonExistingVariantIds.push(variantValue.variant_id);
            }
        }

        if (newData.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "All provided variant values already exist",
            });
        }

        // Add new product variants
        const productVariants = await createProductVariant(newData);

        res.status(201).json({
            status: 201,
            success: true,
            message: "Product variants created successfully",
            result: productVariants,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create product variants, something went wrong",
            error,
        });
    }
};


//  update variant
export const updateAVariantLabel = async (req, res) => {
    const product_variantId = req.params.product_variantId;
    const variant_label = req.body;
    try {
        const updatedVariant = await updateVariantLabel(product_variantId, variant_label);

        if (updatedVariant.length > 0) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Variant label updated successfully",
                result: updatedVariant
            });
        } else {
            res.status(404).json({ success: false, message: 'Variant not found' });
        };

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update variant label",
            error: error
        });
    }
};


// get variant values by variant id
export const getVariantsValues = async (req, res) => {
    const variantId = req.params.variantId;
    console.log(variantId);
    try {
        const variant = await getVariantValuesByVariantId(variantId);
        console.log(variant);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Variant values retrieved successfully",
            result: variant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get variant values",
            error: error
        });
    }
};


//  delete variant
export const deleteVariantLabel = async (req, res) => {
    const productVariantId = req.params.productVariantId;
    try {
        const deleteVariant = await deleteAVariantLabel(productVariantId);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Variant label deleted successfully",
            result: deleteVariant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete variant label",
            error: error
        });
    }
};


export const getVariantsWithProductId = async (req, res) => {
    const productId = req.params.productId;
    console.log(productId);
    try {
        const variants = await getVariantsByProductId(productId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched variants successfully",
            result: variants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch variants",
            error: error
        });
    }
};
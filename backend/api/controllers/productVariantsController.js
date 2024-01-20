import { createProductVariant, deleteAVariantLabel, getVariantLabel, updateVariantLabel } from "../models/productVariantsModel.js";



export const addProductVariantValues = async (req, res) => {
    const { variantId, variantValues } = req.body;
    try {

        let variantData = variantValues.map((value) => {

            return { variant_id: variantId, variant_label: value.variant_label, product_id: value.product_id };
        });
        console.log(variantData)

        const productVariants = await createProductVariant(variantData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Variant values added successfully",
            result: productVariants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to add Variant values",
            error: error
        });
    }
};


// get Variant label by product id
export const getVariantsByProductId = async (req, res) => {
    const { variantId, productId } = req.query;
    console.log(variantId, productId);
    try {
        const variants = await getVariantLabel(variantId, productId);
        console.log(variants);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched Variant successfully",
            result: variants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch Variant",
            error: error
        });
    }
};


//  updated Variant
export const updateAVariantLabel = async (req, res) => {
    const product_variantId = req.params.product_VariantId;
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


//  updated Variant
export const deleteVariantLabel = async (req, res) => {
    const product_variantId = req.params.product_variantId;
    try {
        const deleteVariant = await deleteAVariantLabel(product_variantId);

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
            message: "Failed to delete Variant label",
            error: error
        });
    }
};
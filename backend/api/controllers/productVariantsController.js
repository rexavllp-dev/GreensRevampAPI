
import {  createProductVariant, deleteAVariantLabel, getProductVariantsByIDs, getVariantValuesByVariantId, getVariantsByProductId, updateVariantLabel } from "../models/productVariantsModel.js";




export const addProductVariantValues = async (req, res) => {
    try {
        const data = req.body;
        let productVariantsToSave = [];
        let existingProductVariants = [];

        // Check if variants already exist
        const existingVariants = await getProductVariantsByIDs(data);
        if (existingVariants.length > 0) {
            existingProductVariants = existingVariants.map(variant => ({
                product_id: variant.product_id,
                variant_id: variant.variant_id
            }));
        }

     
        // Filter out data that already exists or has product_id equal to variant_id
        productVariantsToSave = data.filter(item => {
            return !existingProductVariants.some(existingVariant =>
                existingVariant.product_id == item.product_id &&
                existingVariant.variant_id == item.variant_id
            ) && item.product_id != item.variant_id;
        });


        

        if (productVariantsToSave.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "All variants already exist or have product_id equal to variant_id",
                existingVariants: existingVariants,
            });
        }

        const newVariants = await createProductVariant(productVariantsToSave);
        
        // Create reverse variants
        const reverseVariantsToSave = productVariantsToSave.map(item => ({
            product_id: item.variant_id,
            variant_id: item.product_id
        }));
        const reverseVariants = await createProductVariant(reverseVariantsToSave);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Variant values added successfully",
            data: newVariants,
            reverseVariants: reverseVariants
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to add variant values",
            error: error,
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
          status:200,
          success:true,
          message:"Fetched variants successfully",
          result:variants
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status:500,
        success:false,
        message:"Failed to fetch variants",
        error: error
      });  
    }
};
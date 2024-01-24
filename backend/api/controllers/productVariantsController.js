
import {  createProductVariant, deleteAVariantLabel, getVariantValuesByVariantId, getVariantsByProductId, updateVariantLabel } from "../models/productVariantsModel.js";




export const addProductVariantValues = async (req, res) => {

    try {
        const data = req.body;
        //     let productVariants = [];

        //     for (let i = 0; i < variantsData.length; i++) {
        //         const variantId = variantsData[i].variant_id;
        //         productVariants.push({ variant_id: variantId, product_id: productId });
        //     }

        const newVariant = await createProductVariant(data);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Variant values added successfully",
            data: newVariant,
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
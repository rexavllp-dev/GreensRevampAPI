import { createVariant, deleteAVariant, getVariantsWithProductId } from "../models/VariantModel.js";
import { createProductVariant } from "../models/productVariantsModel.js";

// create Variant
export const createNewVariant = async (req, res) => {
  try {
    let data = { variant_name : req.body.variant_name };
    const newVariant = await createVariant(data);


    let variantData = { variant_id: newVariant[0].id, variant_label: "", product_id: req.body.product_id };

  console.log(variantData)

  const productVariants = await createProductVariant(variantData);
  console.log(productVariants);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Variant created successfully",
      result: newVariant
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to create Variant",
      error: error
    });
  }
};




// delete Variant
export const deleteVariant = async (req, res) => {
  const variantId = req.params.variantId;
  try {
    const deleted = await deleteAVariant(variantId);
    if(!deleted) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Variant not found"
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Variant deleted successfully",
      result: deleted
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to delete variant",
      error: error
    });
  }
};

export const getVariantsByProductId = async (req, res) => {
  const productId = req.params.productId;
  try {
    const Variants = await getVariantsWithProductId(productId);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Variants fetched successfully",
      result: Variants
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch Variants",
      error: error
    });
  }
};

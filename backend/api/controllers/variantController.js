import { createProductOption } from "../models/productOptionModel.js";
import { createVariants, deleteAVariants, getVariants, getVariantsById } from "../models/variantModel.js";



// create Variant
// export const createNewVariant = async (req, res) => {
//   try {
//     const newVariant = await createVariants(req.body);

//     res.status(200).json({
//       status: 200,
//       success: true,
//       message: "Variant created successfully",
//       result: newVariant
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: "Failed to create Variant",
//       error: error
//     });
//   }
// };

// create option
export const createNewVariant = async (req, res) => {
  try {
    let data = { variant_name : req.body.variant_name };
    const newVariant = await createVariants(data);


    let variantData = { variant_id: newVariant[0].id, variant_label: "", product_id: req.body.product_id };

  console.log(variantData)

  const productOptions = await createProductOption(optionData);
  console.log(productOptions);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Option created successfully",
      result: newOption
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to create option",
      error: error
    });
  }
};


// get single Variant
export const getSingleVariant = async (req, res) => {
  const variantId = req.params.variantId;

  try {
    const variant = await getVariantsById(variantId);

    if (!variant) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Variant no found",
      });
    };

    res.status(200).json({
      status: 200,
      success: true,
      message: "Fetched Variant successfully",
      result: variant
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


// get all Variants
export const getAllVariants = async (req, res) => {
  try {
    const variants = await getVariants();

    res.status(200).json({
      status: 200,
      success: true,
      message: "Variants fetched successfully",
      result: variants
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



// delete Variant
export const deleteVariant = async (req, res) => {
  const variantId = req.params.variantId;
  try {
    const deleted = await deleteAVariants(variantId);

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
      message: "Failed to delete Variant",
      error: error
    });
  }
};

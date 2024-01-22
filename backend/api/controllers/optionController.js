import { createOption, deleteAOption, getOptionsWithProductId } from "../models/optionModel.js";
import { createProductOption } from "../models/productOptionModel.js";


// create option
export const createNewOption = async (req, res) => {
  try {
    let data = { option_name : req.body.option_name };
    const newOption = await createOption(data);


    let optionData = { option_id: newOption[0].id, option_label: "", product_id: req.body.product_id };

  console.log(optionData)

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




// delete option
export const deleteOption = async (req, res) => {
  const optionId = req.params.optionId;
  try {
    const deleted = await deleteAOption(optionId);
    if(!deleted) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Option not found"
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Option deleted successfully",
      result: deleted
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to delete option",
      error: error
    });
  }
};

export const getOptionsByProductId = async (req, res) => {
  const productId = req.params.productId;
  try {
    const options = await getOptionsWithProductId(productId);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Options fetched successfully",
      result: options
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch options",
      error: error
    });
  }
};

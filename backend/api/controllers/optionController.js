import { createOption, deleteAOption } from "../models/optionModel.js";


// create option
export const createNewOption = async (req,res) => {
    try {
        const newOption = await createOption(req.body);

        res.status(200).json({
          status:200,
          success:true,
          message:"     Option created successfully",
          result:newOption
        });
    } catch (error) {
        res.status(500).json({
          status:500,
          success:false,
          message:"Failed to create option",
          error: error
        });
    }
};



// delete option
export const deleteOption = async (req,res) => {
  const optionId = req.params.optionId;
  try {
    const deleted = await deleteAOption(optionId);

    res.status(200).json({
      status:200,
      success:true,
      message:"Option deleted successfully",
      result: deleted
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status:500,
      success:false,
      message:"Failed to delete option",
      error: error
    });
  }
};

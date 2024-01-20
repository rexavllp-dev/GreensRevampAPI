import { createOption } from "../models/optionModel.js";



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
}
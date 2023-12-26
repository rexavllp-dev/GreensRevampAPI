import { saveFileRecord } from "../models/companyModel.js";
import uploadToS3 from "../utils/s3Service.js";




export const uploadImages = async (req,res) => {
  try {
    const file = req.file;
    console.log(file);

    // upload the to s3 
    const s3Path = await uploadToS3(file, `images/${file.originalname}`);
    console.log(s3Path);

    // save file information to the database
    const result = await saveFileRecord(s3Path);
    res.status(201).json({
      status:201,
      success:true,
      message:"Image saved successfully",
      result:result
    });
  } catch (error) {
    res.status(500).json({
      status:500,
      success:false,
      message:"Internal server error",
      error: error
    });
  }
}
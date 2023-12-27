import aws from 'aws-sdk';
import { saveFileRecord } from "../models/companyModel.js";
import Jimp from "jimp";

const awsConfig = ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig)





export const uploadAndResizeImage = async (req, res) => {

  try {

    const files = req.files;
    const { company_vat_certificate, company_trade_license } = files;

    if (!req.fileData) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No image provided",
      });
    }
    console.log(req.fileData[0].data);




    // Resize image using Jimp
    const resizedImage = await Jimp.read();
    resizedImage.resize(300, 200);
    const resizedImageBuffer = await resizedImage.getBufferAsync(Jimp.AUTO);

    // upload resized to s3 
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `images/${req.file.filename}`,
      Body: resizedImageBuffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };

    const s3Data = await s3.upload(uploadParams).promise();


    // Save URL to database
    // const imageUrl = s3Data.Location;
    // save file information to the database
    const result = await saveFileRecord(s3Data);


    return res.status(201).json({
      status: 201,
      success: true,
      message: "Image saved successfully",
      result: result
    });
  } catch (error) {
    console.log("err" + error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error
    });
  }
};
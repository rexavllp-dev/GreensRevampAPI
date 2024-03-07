import aws from 'aws-sdk';
import { createABanner, updateABanner } from "../models/homePageBannerModel.js";


const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig);


// create a banner 
export const createBanner = async (req, res) => {
    const bannerData = req.body;
    const file = req.files.file; // Use the first file in the array

    try {

        if (!file) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Image file is required for creating a banner."
            });
        };

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `banners/${file.name}`, // Adjust the key/path as needed
            Body: file?.data,
            ContentType: file.mimetype,
        };

        const s3Data = await s3.upload(uploadParams).promise();

        const imageUrl = s3Data.Location;

      
        bannerData.banner_order = parseInt(bannerData.banner_order);

        // Add the image URL to the banner data
        bannerData.banner_image = imageUrl;

        const newBanner = await createABanner(bannerData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Banner created successfully",
            result: newBanner
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create banner",
            error: error
        });
    }
};


// update a banner
export const updateBanner = async (req, res) => {
    const bannerData = req.body;
    const bannerId = req.params.id;
    const file = req.files.file; // Use the first file in the array

    try {

        if (!file) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Image file is required for creating a banner."
            });
        };

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `banners/${file.name}`, // Adjust the key/path as needed
            Body: file?.data,
            ContentType: file.mimetype,
        };

        const s3Data = await s3.upload(uploadParams).promise();

        const imageUrl = s3Data.Location;

      
        bannerData.banner_order = parseInt(bannerData.banner_order);

        // Add the image URL to the banner data
        bannerData.banner_image = imageUrl;

        const newBanner = await updateABanner(bannerId, bannerData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Banner created successfully",
            result: newBanner
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create banner",
            error: error
        });
    }
};

import aws from 'aws-sdk';
import { createAAds, deleteAAds, getAAds, getsAllAdss, updateAAds } from '../models/adsModel.js';



const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig);


// create a feed 
export const createAds = async (req, res) => {

    const adsData = req.body;
    const file = req.files.file; // Use the first file in the array

    try {

        if (!file) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Image file is required for creating a feed."
            });
        };

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `ads/${file.name}`, // Adjust the key/path as needed
            Body: file?.data,
            ContentType: file.mimetype,
        };

        const s3Data = await s3.upload(uploadParams).promise();

        const imageUrl = s3Data.Location;




        // Add the image URL to the feed data
        adsData.ads_image = imageUrl;

        const newfeed = await createAAds(adsData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "feed created successfully",
            result: newfeed
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create feed",
            error: error
        });
    }
};


// update a feed
export const updateAds = async (req, res) => {
    const adsData = req.body;
    const adsId = req.params.adsId;
    const file = req.files.file;

    try {

        if (!file) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Image file is required for creating a feed."
            });
        };

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `ads/${file.name}`, // Adjust the key/path as needed
            Body: file?.data,
            ContentType: file.mimetype,
        };

        const s3Data = await s3.upload(uploadParams).promise();

        const imageUrl = s3Data.Location;

        // Add the image URL to the feed data
        adsData.ads_image = imageUrl;

        const newfeed = await updateAAds(adsId, adsData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "feed created successfully",
            result: newfeed
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create feed",
            error: error
        });
    }
};



export const getSingleAds = async (req, res) => {
    const adsId = req.params.adsId;

    try {

        const feed = await getAAds(adsId);


        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched feed successfully",
            result: feed
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch feed",
            error: error
        });
    }
};


export const getAllAds = async (req, res) => {
    try {
        const feeds = await getsAllAdss();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched feeds successfully",
            result: feeds
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch feeds",
            error: error
        });
    }
};



export const deleteAds = async (req, res) => {

    const adsId = req.query.data;

    try {

        let ads = JSON.parse(adsId);

        for (let i = 0; i < ads.length; i++) {
            await deleteAAds(ads[i]);
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'feeds deleted successfully',

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete feeds. Please try again later.',
        });
    }
};
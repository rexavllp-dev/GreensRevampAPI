import aws from 'aws-sdk';
import { createAFeed, deleteAFeed, getAFeed, getsAllFeeds, updateAFeed } from '../models/feedModel.js';


const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig);


// create a feed 
export const createFeed = async (req, res) => {

    const feedData = req.body;
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
            Key: `feeds/${file.name}`, // Adjust the key/path as needed
            Body: file?.data,
            ContentType: file.mimetype,
        };

        const s3Data = await s3.upload(uploadParams).promise();

        const imageUrl = s3Data.Location;




        // Add the image URL to the feed data
        feedData.feed_image = imageUrl;

        const newFeed = await createAFeed(feedData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "feed created successfully",
            result: newFeed
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
export const updateFeed = async (req, res) => {
    const feedData = req.body;
    const feedId = req.params.feedId;
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
            Key: `feeds/${file.name}`, // Adjust the key/path as needed
            Body: file?.data,
            ContentType: file.mimetype,
        };

        const s3Data = await s3.upload(uploadParams).promise();

        const imageUrl = s3Data.Location;

        // Add the image URL to the feed data
        feedData.feed_image = imageUrl;

        const newfeed = await updateAFeed(feedId, feedData);

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



export const getSingleFeed = async (req, res) => {
    const feedId = req.params.feedId;

    try {

        const feed = await getAFeed(feedId);


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


export const getAllFeeds = async (req, res) => {
    try {
        const feeds = await getsAllFeeds();

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


export const deleteFeed = async (req, res) => {

    const feedId = req.query.data;

    try {

        let feeds = JSON.parse(feedId);

        for (let i = 0; i < feeds.length; i++) {
            await deleteAFeed(feeds[i]);
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
import aws from 'aws-sdk';
import { createASeason,  deleteASeason,  getASeason, getsAllSeasons, updateASeason } from '../models/seasonModel.js';

const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig);


// create a season 
export const createSeason = async (req, res) => {
    
    const seasonData = req.body;
    

    try {

        if (!req.files) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Image file is required for creating a season."
            });
        };

        const file = req.files.season_image; // Use the first file in the array

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `seasons/${file.name}`, // Adjust the key/path as needed
            Body: file?.data,
            ContentType: file.mimetype,
        };

        const s3Data = await s3.upload(uploadParams).promise();

        const imageUrl = s3Data.Location;

        // Add the image URL to the season data
        seasonData.season_image = imageUrl;

        const newseason = await createASeason(seasonData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Season created successfully",
            result: newseason
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create season",
            error: error
        });
    }
};


// update a season
export const updateSeason = async (req, res) => {

    const seasonData = req.body;

    const seasonId = req.params.seasonId;


    try {

        if (req.files) {

            const file = req.files?.season_image;

            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `seasons/${file.name}`, // Adjust the key/path as needed
                Body: file?.data,
                ContentType: file.mimetype,
            };

            const s3Data = await s3.upload(uploadParams).promise();

            const imageUrl = s3Data.Location;

            // Add the image URL to the season data
            seasonData.season_image = imageUrl;

        };


        const newseason = await updateASeason(seasonId, seasonData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "season update successfully",
            result: newseason
        });

    } catch (error) {
     
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update season",
            error: error
        });
    }
};



export const getSingleSeason = async (req, res) => {
    const seasonId = req.params.seasonId;

    try {

        const season = await getASeason(seasonId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched season successfully",
            result: season
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch season",
            error: error
        });
    }
};


export const getAllSeasons = async (req, res) => {
    try {
        const seasons = await getsAllSeasons();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched seasons successfully",
            result: seasons
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch seasons",
            error: error
        });
    }
};




export const deleteSeason = async (req, res) => {

    const seasonId = req.query.data;

    try {

        let seasons = JSON.parse(seasonId);

        for (let i = 0; i < seasons.length; i++) {

            await deleteASeason(seasons[i]);
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'seasons deleted successfully',

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete seasons. Please try again later.',
        });
    }
};
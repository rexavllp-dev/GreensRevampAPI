import { addReturnImage, createReturnPrd, getAllReturnProducts, getReturnById, updateReturnStatusByAdmin } from "../models/returnModel.js";
import sharp from "sharp";
import aws from 'aws-sdk';


const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig);


// return products controller
export const returnProduct = async (req, res) => {

    const returnData = req.body;
    const userId = req.user.userId;
    let files = req.files?.files;


    try {

        // Check if files are uploaded
        if (!files || !files.length) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "File are required for return request."
            });
        };

        if (!files?.length) {
            files = [files]
        }

        let returnImages = [];

        const newReturn = await createReturnPrd(1, returnData);
        const returnId = newReturn[0].id;
        console.log(returnId);

        for (let i = 0; i < files?.length; i++) {
            const file = files[i];


            const resizedBuffer = await sharp(file.data)
                .resize({ width: 300, height: 300 })
                .toBuffer();

            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/${file.name}`,
                Body: resizedBuffer,
                ContentType: file.mimetype,
            };

            const s3Data = await s3.upload(uploadParams).promise();

            const imageUrl = s3Data.Location;
            console.log(imageUrl);

            await addReturnImage(returnId, imageUrl);

            const imageDetails = {
                return_id: returnId,
                url: s3Data.Location,
            };

            returnImages.push(imageDetails);
        };

        console.log(returnImages);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Return request submitted successfully.",
            result: newReturn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to submit return request.",
            error: error
        });
    }
};


// admin controllers returns


// get single returns
export const getSingleReturn = async (req, res) => {

    const returnId = req.params.returnId;

    try {

        const returnData = await getReturnById(returnId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched returns successfully",
            result: returnData
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch returns",
            result: error
        });

    }
};


// get all returns for admin 
export const getAllReturnsForAdmin = async (req, res) => {

    try {
        const returns = await getAllReturnProducts();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Returns fetched successfully',
            result: returns
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed to get returns. Please try again later.',
            error: error

        });
    }
};

// admin return status update
export const updateReturnStatus = async (req, res) => {

    const { return_status } = req.body;
    const returnId = req.params.returnId;

    console.log(return_status);
    try {
        const updatedData = await updateReturnStatusByAdmin(returnId, return_status);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Updated return status successfully",
            result: updatedData
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update return status",
            error: error
        });
    }
};
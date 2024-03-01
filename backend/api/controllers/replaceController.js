import sharp from "sharp";
import aws from 'aws-sdk';
import { addReplaceImage, createReplacePrd } from "../models/replaceModel.js";


const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig);


// replace  products controller
export const replaceAProduct = async (req, res) => {

    const replaceData = req.body;
    const userId = req.user.userId;
    let files = req.files?.files;


    try {

        // Check if files are uploaded
        if (!files || !files.length) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "File are required for replacement request."
            });
        };

        if (!files?.length) {
            files = [files]
        }

        let replaceImages = [];

        const newReplace = await createReplacePrd(1, replaceData);
        const replaceId = newReplace[0].id;
        console.log(replaceId);

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

            await addReplaceImage(replaceId, imageUrl);

            const imageDetails = {
                replace_id: replaceId,
                url: s3Data.Location,
            };

            replaceImages.push(imageDetails);
        };

        console.log(replaceImages);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Replacement request submitted successfully.",
            result: newReplace
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to submit replacement request.",
            error: error
        });
    }
};



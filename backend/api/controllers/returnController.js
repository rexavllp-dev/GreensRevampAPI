import { addReturnImage, createReturnPrd } from "../models/returnModel.js";
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

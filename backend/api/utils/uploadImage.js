import sharp from "sharp";
import aws from 'aws-sdk';

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
};

const s3 = new aws.S3(awsConfig);

const uploadAndResizeImage = async (file) => {

    try {


        const resizedBuffer = await sharp(file.files.data)
            .resize(2000)
            .webp({ quality: 100 })  // Adjust quality as needed
            .jpeg({ quality: 100, progressive: true, force: false })  // Adjust quality and other options as needed
            .png({ quality: 100, force: false })  // Adjust compression level and other options as needed
            .toBuffer();

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `images/${file.files.name}`,
            Body: resizedBuffer,
            ContentType: file.files.mimetype,
        };

        const s3Data = await s3.upload(uploadParams).promise();
        console.log("Uploaded image data:", s3Data);
        return s3Data.Location;

    } catch (error) {

        console.error("Error in uploadAndResizeImage:", error);
        throw new Error("Failed to upload and resize image: " + error.message);

    }
};



export default uploadAndResizeImage;

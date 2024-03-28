import sharp from 'sharp';
import AWS from 'aws-sdk';
import maintenanceModeMessage from 'aws-sdk/lib/maintenance_mode_message.js';

// Suppress maintenance mode warning
maintenanceModeMessage.suppress = true;


// Create S3 instance
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const resizeAndUpload = async (file) => {
    try {
        // Check if the file is a PDF, JPEG, or PNG
        if (file.mimetype === 'image/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // Resize only if it's a PDF, JPEG, PNG 
            const resizedBuffer = await sharp(file.data)
                .resize(2800)
                .webp({ quality: 100 })  // Adjust quality as needed
                .jpeg({ quality: 100, progressive: true, force: false })  // Adjust quality and other options as needed
                .png({ quality: 100, force: false })  // Adjust compression level and other options as needed
                .toBuffer();

            // Upload the resized image to S3
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/${file.name}`, // Adjust the destination path as needed
                Body: resizedBuffer,
                ContentType: file.mimetype
            };

            const s3Data = await s3.upload(uploadParams).promise();
            return s3Data.Location; // Return the URL of the uploaded image
        } else {
            // If it's not a PDF, JPEG, or PNG, upload the original file without resizing
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/${file.name}`, // Adjust the destination path as needed
                Body: file.data,
                ContentType: file.mimetype
            };

            const s3Data = await s3.upload(uploadParams).promise();
            return s3Data.Location; // Return the URL of the uploaded image
        }
    } catch (error) {
        console.error("Error resizing and uploading image:", error);
        throw error;
    }
};



export default resizeAndUpload;

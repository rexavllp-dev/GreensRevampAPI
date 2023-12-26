// s3Service.js
import AWS from 'aws-sdk';
import fs from 'fs';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();
const uploadToS3 = async (file, fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: fs.createReadStream(file.path),
    ContentType: file.mimetype,
  };
  const result = await s3.upload(params).promise();
  fs.unlinkSync(file.path); // Delete the temporary file
  return result.Location;
};

export default uploadToS3;
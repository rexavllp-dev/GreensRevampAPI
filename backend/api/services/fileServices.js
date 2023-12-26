import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { Readable } from 'stream';
import sharp from 'sharp';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

export const uploadToS3 = async (file) => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now().toString()}`,
    Body: file.buffer,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(s3Params);
  await s3Client.send(command);

  return `https://your-s3-bucket-name.s3-your-s3-region.amazonaws.com/${s3Params.Key}`;
};

export const resizeAndUpload = (file) => {
  return new Promise((resolve, reject) => {
    sharp(file.buffer)
      .resize(300, 300) // Adjust the size as needed
      .toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const readableStream = new Readable();
          readableStream.push(buffer);
          readableStream.push(null);

          const resizedFile = {
            buffer: buffer,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: buffer.length,
            stream: readableStream,
          };

          uploadToS3(resizedFile)
            .then(resolve)
            .catch(reject);
        }
      });
  });
};
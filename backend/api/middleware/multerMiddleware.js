import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        ACL: 'public-read',
        metadata: function (req, file, cb) {
            // if file is an image resize the image using resizeAndUpload
            // if (file.mimetype.startsWith('image')) {
            //     resizeAndUpload(file).then((resizedFile) => {
            //         cb(null, { fieldName: resizedFile.fieldname });
            //     });
            // } else {
            //      cb(null, { fieldName: file.fieldname });
            // }

            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});



export const resizeAndUpload = (file) => {
    console.log(file);
    var fileBuffer = Buffer.from(file)
    return new Promise((resolve, reject) => {
        sharp(fileBuffer)
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
                        fieldname: file.fieldname,
                        originalname: file.originalname,
                        mimetype: file.mimetype,
                        size: buffer.length,
                        stream: readableStream,
                    };

                    return resolve(resizedFile);
                }
            });
    });
};
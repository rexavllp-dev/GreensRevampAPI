import { joiOptions } from '../helpers/joiOptions.js';
import Joi from 'joi';
import { createABrand, deleteABrand, getBrandById, getBrands, updateABrand } from '../models/brandModel.js';
import sharp from 'sharp';
import aws from 'aws-sdk';
import getErrorsInArray from '../helpers/getErrors.js';



const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig)

export const createBrand = async (req, res) => {
    const { brd_name, brand_status } = req.body;
    try {
        const schema = Joi.object({
            brd_name: Joi.string().required().label("brd_name"),
        });

        const validate_data = {
            brd_name,
        };

        const { error } = schema.validate(validate_data, joiOptions);
        if (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Validation Error",
                error: getErrorsInArray(error?.details),
            });
        };

        const newBrand = await createABrand({
            brd_name,
            brand_status,
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: "Brand created successfully",
            data: newBrand
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create brand",
            error: error,
        });
    }
};


// upload brand logo and brand banner
export const uploadBrandImages = async (req, res) => {
    try {
        const brandId = req.params.brandId;
        const files = req.files;

        // Check if there are files
        if (!req.files) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "No image provided",
            });
        };

        if (!brandId) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Brand not found",
            });
        }

        let brd_logo;
        let brd_banner;

        for (const field in files) {
            const file = files[field];

            // Check if the file is a PDF or JPEG before processing
            if (file.mimetype === 'image/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                // Resize only if it's a PDF, JPEG, PNG 
                const resizedBuffer = await sharp(file.data)
                    .resize({ width: 300, height: 300 }) // Adjust the dimensions as needed
                    .toBuffer();

                // Upload resized image to S3
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `images/${file.name}`,
                    Body: resizedBuffer, // Use the resized buffer
                    ContentType: file.mimetype,
                };

                const s3Data = await s3.upload(uploadParams).promise();

                if (field === "brd_logo") {
                    brd_logo = s3Data.Location;
                } else {
                    brd_banner = s3Data.Location;
                }
            } else {
                // If it's not a PDF or JPEG, upload the original file without resizing
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `images/${file.name}`,
                    Body: file.data,
                    ContentType: file.mimetype,
                };

                const s3Data = await s3.upload(uploadParams).promise();

                if (field === "brd_logo") {
                    brd_logo = s3Data.Location;
                } else {
                    brd_banner = s3Data.Location;
                }
            }
        }

        await updateABrand(brandId, {
            brd_logo,
            brd_banner,
        })


        res.status(201).json({
            status: 201,
            success: true,
            message: "Brand images uploaded successfully",
            result: {
                brd_logo,
                brd_banner,
            }

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to upload brand images. Please try again later."
        });
    }
};

// update brands
export const updateBrand = async (req, res) => {
    try {
        const { brd_name, brand_status } = req.body;
        const brandId = req.params.brandId;

        const updateBrand = await updateABrand(brandId, {
            brd_name,
            brand_status,
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: "Update brand successfully",
            result: updateBrand
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update",
            error: error
        });
    }
};


export const getSingleBrand = async (req, res) => {
    const brandId = req.params.brandId;
    try {
        const brand = await getBrandById(brandId);
        if (!brand) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Brand not found",
            });
        };

        res.status(200).json({
            status: 200,
            success: true,
            message: "Brand fetched successfully",
            result: brand
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to fetch brand. Please try again later.',
        });
    }
};



export const getAllBrands = async (req, res) => {
    try {
        const brands = await getBrands();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Brands fetched successfully',
            data: brands,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 200,
            success: true,
            message: 'Failed to fetch brands. Please try again later',
            error: error,
        });
    }
};


export const deleteBrand = async (req, res) => {
    try {
        const brandId = req.params.brandId;
        const deletedBrand = await deleteABrand(brandId);

        if (!deletedBrand) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Brand not found",
            });
        };

        res.status(200).json({
            status: 200,
            success: true,
            message: "Brand deleted successfully",
            result: deletedBrand
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete brand. Please try again later.',
        });
    }
};

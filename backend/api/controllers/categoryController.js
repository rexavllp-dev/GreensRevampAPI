import { joiOptions } from '../helpers/joiOptions.js';
import Joi from 'joi';
import sharp from 'sharp';
import aws from 'aws-sdk';
import { createACategory, deleteACategory, getCategories, getCategoriesByParentId, getCategoriesTree, getCategoryById,  updateACategory } from '../models/categoryModel.js';
import getErrorsInArray from '../helpers/getErrors.js';



const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig)


// create category
export const createCategory = async (req, res) => {
    const {  cat_parent_id, cat_name, cat_description } = req.body;
    try {
        const schema = Joi.object({
            cat_parent_id: Joi.number().required().label("cat_parent_id"),
            cat_name: Joi.string().required().label("cat_name"),
            cat_description: Joi.string().required().label("cat_description"),
        });

        const validate_data = {
            cat_parent_id,
            cat_name,
            cat_description
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

        const newCategory = await createACategory({
            cat_parent_id,
            cat_name,
            cat_description,
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: "Category created successfully",
            data: newCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create category",
            error: error,
        });
    }
};


// upload Category logo and Category banner
export const uploadCategoryImages = async (req, res) => {
    try {
        const files = req.files;

        // Check if there are files
        if (!req.files) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "No image provided",
            });
        }

        let cat_logo;
        let cat_banner;

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

                if (field === "cat_logo") {
                    cat_logo = s3Data.Location;
                } else {
                    cat_banner = s3Data.Location;
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

                if (field === "cat_logo") {
                    cat_logo = s3Data.Location;
                } else {
                    cat_banner = s3Data.Location;
                }
            }
        }

        // Now, you can use cat_logo and cat_banner in your database operations or save them as needed.

        res.status(201).json({
            status: 201,
            success: true,
            message: "Category images uploaded successfully",
            result: {
                cat_logo,
                cat_banner,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to upload Category images. Please try again later."
        });
    }
};

// update Category
export const updateCategory = async (req, res) => {
    try {
        const { cat_name, cat_description, category_status } = req.body;
        const categoryId = req.params.categoryId;

        const updateCategory = await updateACategory(categoryId, {
            cat_name,
            cat_description,
            category_status
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: "Update Category successfully",
            result: updateCategory
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

// get categories by parentId
export const getCategoriesWithParentId = async (req, res) => {
    try {
        const parentId = req.params.parentId;
        const categories = await getCategoriesByParentId(parentId);
        if (!categories) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Category not found",
            });
        };

        res.status(200).json({
          status:200,
          success:true,
          message:"Category fetched successfully",
          result: categories
        });
    } catch (error) {
        res.status(500).json({
          status:500,
          success:false,
          message:"Failed to fetch category",
          error: error
        });
    }

}


export const getSingleCategory = async (req, res) => {
    const CategoryId = req.params.categoryId;
    try {
        const category = await getCategoryById(CategoryId);
        if (!category) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Category not found",
            });
        };
        
        res.status(200).json({
          status:200,
          success:true,
          message:"Category fetched successfully",
          result: category
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to fetch category. Please try again later.',
        });
    }
};



export const getAllCategories = async (req, res) => {
    try {
        const categories = await getCategories();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Categories fetched successfully',
            data: categories,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 200,
            success: true,
            message: 'Failed to fetch categories. Please try again later',
            error: error,
        });
    }
};


export const deleteCategory = async (req,res) => {
    try {
        const categoryId = req.params.categoryId;
        const deletedCategory = await deleteACategory(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Category not found",
            });
        };

        res.status(200).json({
          status:200,
          success:true,
          message:"Category deleted successfully",
          result: deletedCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete Category. Please try again later.',
        });
    }
};


export const getCategoriesByTree = async (req, res) => {
    try {
        const categoryTree = await getCategoriesTree();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Categories fetched successfully',
            data: categoryTree,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed to fetch categories. Please try again later',
            error: error,
        });
    }
}
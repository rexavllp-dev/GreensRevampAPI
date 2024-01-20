import { createAProduct, createProductGallery, deleteAProduct, getAllProducts, getProductById, getSortedProducts, updateAProduct } from "../models/productModel.js";
import { joiOptions } from '../helpers/joiOptions.js';
import Joi from 'joi';
import getErrorsInArray from '../helpers/getErrors.js';
import sharp from "sharp";
import aws from 'aws-sdk';


const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig)

// create products
export const createProduct = async (req, res) => {

    const {

        prd_name,
        prd_description,
        prd_storage_type,
        prd_tax_class,
        prd_tags,
        prd_expiry_date,
        prd_dashboard_status,
        prd_status,
        prd_sales_unit,
        prd_return_type,
        prd_brand_id,
        
        

    } = req.body;

    try {

    const schema = Joi.object({
        prd_name: Joi.string().required().label("prd_name"),
        prd_description: Joi.string().required().label("prd_description"),
        prd_storage_type: Joi.string().required().label("prd_storage_type"),
        prd_tax_class: Joi.string().valid('vat5%').required().label("prd_tax_class"),
        prd_tags: Joi.string().required().label("prd_tags"),
        prd_expiry_date: Joi.date().required().label("prd_expiry_date"),
        prd_dashboard_status: Joi.boolean().label("prd_dashboard_status"),
        prd_status: Joi.boolean().required().label("prd_status "),
        prd_sales_unit: Joi.string().required().label("prd_sales_unit"),
        prd_return_type: Joi.string().required().label("prd_return_type"),
        prd_brand_id: Joi.number().integer().required().label(" prd_brand_id"),
       
    });
      


        // product validation data

        const validate_data = {

            prd_name,
            prd_description,
            prd_storage_type,
            prd_tax_class,
            prd_tags,
            prd_expiry_date,
            prd_dashboard_status,
            prd_status,
            prd_sales_unit,
            prd_return_type,
            prd_brand_id,
            
            

        };

        const { error } = schema.validate(validate_data, joiOptions);
        console.log(error)
        if (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Validation Error",
                error: getErrorsInArray(error?.details),
            });
        };


        // create a product
        const newProduct = await createAProduct({

            prd_name,
            prd_description,
            prd_storage_type,
            prd_tax_class,
            prd_tags,
            prd_expiry_date,
            prd_dashboard_status,
            prd_status,
            prd_sales_unit,
            prd_return_type,
            prd_brand_id,
            

        })

        res.status(201).json({
            status: 201,
            success: true,
            message: "product created successfully",
            data: newProduct
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to Create Product! Please try again later."
        });
    }

};


// update product 

export const updateProduct = async (req, res) => {
    try {
        const {

            prd_name,
            prd_description,
            prd_storage_type,
            prd_tax_class,
            prd_tags,
            prd_expiry_date,
            prd_dashboard_status,
            prd_status,
            prd_sales_unit,
            prd_return_type,
            prd_brand_id,
            prd_price,

            
        } = req.body;

        const productId = req.params.productId; // Assuming you have a route parameter for the product ID

        // Call the model function to update the product
        const updatedProduct = await updateAProduct(productId, {
            prd_name,
            prd_description,
            prd_storage_type,
            prd_tax_class,
            prd_tags,
            prd_expiry_date,
            prd_dashboard_status,
            prd_status,
            prd_sales_unit,
            prd_return_type,
            prd_brand_id,
            
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to update product. Please try again later.',
        });
    }
};


// get all products

export const getAllProduct = async (req, res) => {
    try {

        let page = null;
        let per_page = null;
        let search_query = null;
        if (req.query.search_query !== null && req.query.search_query !== undefined && req.query.search_query !== 'undefined') {
            search_query = req.query.search_query;
        }
        if (req.query.page !== null && req.query.page !== undefined && req.query.page !== 'undefined') {
            page = req.query.page;
        }
        if (req.query.per_page !== null && req.query.per_page !== undefined && req.query.per_page !== 'undefined') {
            per_page = req.query.per_page;
        }
        console.log(search_query);                                                                                                     

        const filtersParam = req.query.filters;

        let filters = [];

        // Attempt to parse the filters parameter
        if (filtersParam) {
            filters = JSON.parse(filtersParam);
        };
       
        const products = await getAllProducts(page, per_page, search_query, filters);
        console.log("products",products);

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Products fetched successfully',
            data: products,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to fetch Product! Please try again later."
        });
    }
};

// get a product

export const getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

      
        const products = await getProductById(productId);
        console.log(products);
        if (!products  || products.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Product not found',
            });
        };


        const productUrls = products.map(product => ({
            id: product.id,
            product_id: product.id,
            url: product.url,
            is_baseimage: product.is_baseimage,
        }));
       

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product single fetched successfully',
            data: {
                product : products,
                productUrls: productUrls
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to fetch product. Please try again later.',
        });
    }
};


// delete a product

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await deleteAProduct(productId);
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product deleted successfully',
            data: deletedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete product. Please try again later.',
        });
    }
};


// add product images
export const addProductImages = async (req, res) => {
    
    try {
        const productId = req.params.productId;
        let files = req.files?.files;
       
        if(!files?.length) {
            files = [files]
        }
        const isBaseImage = req.body?.isBaseImage;
        let productImages = [];

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

            const imageDetails = {
                product_id: productId,
                url: s3Data.Location,
                is_baseimage: isBaseImage,
            };

            productImages.push(imageDetails);
        }
        console.log(productImages);

        // Save product images to the database
        await createProductGallery(productImages);

        res.status(201).json({
            status: 201,
            success: true,
            message: "Product images added successfully.",
            result: productImages,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to add product images! Please try again later.",
        });
    }
};


// product sorting
export const getProductsWithSorting = async (req, res) => {
    const { sortBy } = req.body;
    try {
        const products = await getSortedProducts(sortBy);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Product sorted successfully",
            result: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to sort products"
        });
    }
};
      


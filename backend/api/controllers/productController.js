import { createAProduct, deleteAProduct, getAllProducts, getProductById, updateAproduct } from "../models/productModel.js";
import { joiOptions } from '../helpers/joiOptions.js';
import Joi from 'joi';
import getErrorsInArray from '../helpers/getErrors.js';


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
        sku_code,
        prd_price,
       


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
        prd_price: Joi.number().required().label(" prd_price"),
        sku_code: Joi.string().required().label(" sku_code")
       
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
        prd_price,
       
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
        prd_price,

    })

    res.status(201).json({
        status: 201,
        success: true,
        message: "product created successfully",
        

    });



}catch(error){
    console.log(error)
    res.status(500).json({
        status: 500,
        success: false,
        error: error,
        message: "Failed to Create Product! Please try again later."
    });
}
   
}


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
            sku_code,
            prd_return_type,
            prd_brand_id,
            prd_price,
        } = req.body;

        const productId = req.params.productId; // Assuming you have a route parameter for the product ID

        // Call the model function to update the product
        const updatedProduct = await updateAproduct(productId, {
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
            sku_code,
            prd_price,
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
        
        const products = await getAllProducts();


        res.status(200).json({
            status: 200,
            success: true,
            message: 'Products fetched successfully',
            data: products,
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to fetch Product! Please try again later."
        });
    }
}

// get a product

export const getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.productId; 
       
        // Assuming you have a route parameter for the product ID
        const product = await getProductById(productId);
        // console.log(product);
        if (!product) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product single fetched successfully',
            data: product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to fetch single product. Please try again later.',
        });
    }
}


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
}

// get price
export const getPrice = async (req, res) => {
    try {
        const price = await getProductPrice(req.params.priceId);
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Get the price successfully',
            data: price,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to get price. Please try again later.',
        });
    }
}


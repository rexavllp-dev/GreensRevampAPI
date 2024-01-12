import { createAProduct, createProduct } from "../models/productModel";
import { joiOptions } from '../helpers/joiOptions.js';


// create products

export const registerUser = async (req, res) => {


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
        prd_brand_name,
        prd_price,
       


    } = req.body;

try {

    const schema = Joi.object({
        prd_name:joi.string().required().label("prd_name "),
        prd_description: Joi.string().required().label("prd_description"),
        prd_storage_type: Joi.string().required().label("prd_storage_type"),
        prd_tax_class: Joi.number().required().label("prd_tax_class"),
        prd_tags: Joi.string().required().label("prd_tags"),
        prd_expiry_date: Joi.string().required().label("prd_expiry_date"),
        prd_dashboard_status: Joi.string().label("prd_dashboard_status"),
        prd_status: Joi.boolean().required().label("prd_status "),
        prd_sales_unit: Joi.boolean().required().label("prd_sales_unit"),
        prd_return_type: Joi.boolean().required().label("prd_return_type"),
        prd_brand_name: Joi.boolean().required().label(" prd_brand_name"),
        prd_price: Joi.boolean().required().label(" prd_price"),
       
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
        prd_brand_name,
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
        prd_brand_name,
        prd_price,

    })

    res.status(201).json({
        status: 201,
        success: true,
        message: "product created successfully",
        result: {
           
        }

    });



}catch(error){
    res.status(500).json({

        status: 500,
        success: false,
        error: error,
        message: "Failed Create Product! Please try again later."
    });
}
   
}

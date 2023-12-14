import { createCompany } from "../models/companyModel.js";
import Joi from 'joi';
import { joiOptions } from '../helpers/joiOptions.js';
import getErrorsInArray from '../helpers/getErrors.js';


// creating a company functions 
export const registerCompany = async (req, res) => {

    const {
        company_name,
        company_landline,
        company_landline_country_code,
        company_vat_certificate,
        company_trn_number,
        company_trade_license,
        company_trade_license_expiry,

    } = req.body;

    // console.log(company_landline_country_code);

    try {

        // Register company validation 
        const schema = Joi.object({
            company_name: Joi.string().required().label("Company Name"),
            company_landline: Joi.string().required().label("Landline"),
            company_landline_country_code: Joi.number().required().label("Country Code"),
            company_vat_certificate: Joi.string().required().label("Vat Certificate"),
            company_trn_number: Joi.number().required().label("Trn Number"),
            company_trade_license: Joi.string().required().label("Trade License"),
            company_trade_license_expiry: Joi.date().required().label("Trade License Expiry Date"),

        });

          // Register company validation data

          const validate_data = {
            company_name,
            company_landline,
            company_landline_country_code,
            company_vat_certificate,
            company_trn_number,
            company_trade_license,
            company_trade_license_expiry,
    
        };


        const { error } = schema.validate(validate_data, joiOptions);
        if (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Validation Error",
                error: getErrorsInArray(error?.details),
            });
        };


        const newCompany = await createCompany(req.body);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Company  registered  successfully!",
            result: newCompany,
        });

    } catch (error) {
        console.log(error);

         // Check if the error is due to a unique 
         if (error.code === '23505') {
            return res.status(500).json({
                status: 403,
                success: false,
                message: "Company already exist",
                error: error?.detail
            });

        } else {
            console.error('Error inserting user:', error);
        }

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create company! Please try again later."

        });
    }
};
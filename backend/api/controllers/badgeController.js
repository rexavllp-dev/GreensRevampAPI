import { joiOptions } from '../helpers/joiOptions.js';
import Joi from 'joi';
import getErrorsInArray from '../helpers/getErrors.js';
import { createBadge } from '../models/badgeModel.js';


export const createProductBadge = async (req, res) => {


    const {

        product_id,
        badge_name,

    } = req.body;

    try {

        const schema = Joi.object({
            
            product_id: Joi.number().integer().required().label(" product_id"),
            badge_name: Joi.string().required().label("badge_name"),
            
            

        });



        // product validation data

        const validate_data = {

            product_id,
            badge_name,

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
        const newInventory = await createBadge({

            product_id,
            badge_name,

        })

        res.status(201).json({
            status: 201,
            success: true,
            message: "badge created successfully",
            data: newInventory
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to Create badge! Please try again later."
        });
    }

};
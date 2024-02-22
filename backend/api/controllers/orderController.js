import Joi from 'joi';
import { joiOptions } from '../helpers/joiOptions.js';
import  getErrorsInArray  from '../helpers/getErrors.js';


import {  createOrderItems, createUserOrder, getAOrder, getOrders, insertNewAddressIntoDatabase, updateAnOrder } from "../models/orderModel.js";



export const createOrder = async (req, res) => {
    const {

        address_id,
        customer_name,
        customer_email,
        customer_phone,
        address_line,
        flat_villa,
        is_new_address,
        // zip_code,
        payment_method,
        shipping_method,
        orderItems,
        
       

    } = req.body;

    // console.log(req.body);

    const customerId = req.user.userId;

try {

    const schema = Joi.object({
        customer_name: Joi.string().required().label("Customer Name"),
        customer_email: Joi.string().email().required().label("Customer Email"),
        customer_phone: Joi.string().required().label("Customer Phone"),
        address_line: Joi.string().required().label("Address Line"),
        flat_villa: Joi.string().required().label("Flat/Villa"),
        // zip_code: Joi.string().required().label("Zip Code"),
        payment_method: Joi.string().required().label("Payment Method"),
        shipping_method: Joi.string().required().label("Shipping Method"),
    });

    const validate_data = {
        customer_name,
        customer_email,
        customer_phone,
        address_line,
        flat_villa,
        // zip_code,
        payment_method,
        shipping_method,
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


    const orderData = {

        address_id: null,
        customer_name,
        customer_email,
        customer_phone,
        address_line,
        flat_villa,
        is_new_address,
        // zip_code,
        payment_method,
        shipping_method,
        orderItems,
    };


     // If it's a new address, insert the new address into the database
     if (is_new_address) {
        // Insert the new address into the database
        const insertedAddressId = await insertNewAddressIntoDatabase(customerId, address_line, flat_villa, customer_name, customer_phone);
        orderData.address_id = insertedAddressId; // Assign the new address ID
    } else {
        // Use the selected existing address ID
        orderData.address_id = address_id;
    }




       // Create order data
       const newOrder = await createUserOrder(9, orderData);

       // Create order items
       await createOrderItems(newOrder[0].id, orderItems);

    //   console.log( orderData, orderItems);

    res.status(200).json({
      status:200,
      success:true,
      message:"Successfully created order",
      result:newOrder
    });



} catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create order",
            error: error
        });
    }


};



export const updateOrder = async (req, res) => {
    const orderId = req.params.orderId;
    const updatedData = req.body;

    try {

        const updatedOrder = await updateAnOrder(orderId, updatedData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Order updated successfully",
            result: updatedOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create an order",
            error: error
        });
    }
};


export const getASingleOrder = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await getAOrder(orderId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched order successfully",
            result: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch order",
            error: error
        });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const orders = await getOrders();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched orders successfully",
            result: orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch orders",
            error: error
        });
    }
};


export const cancelOrder = async (req, res) => {
    const orderId = req.params.orderId;

    try {

    } catch (error) {

    }
}







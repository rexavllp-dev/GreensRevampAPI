import Joi from 'joi';
import { joiOptions } from '../helpers/joiOptions.js';
import getErrorsInArray from '../helpers/getErrors.js';
import fs from 'fs';


import { createOrderItems, createUserOrder, getAOrder, getAllUserOrders, insertNewAddressIntoDatabase, updateAnOrder } from "../models/orderModel.js";
import { getUserAddress } from '../models/addressModel.js';
import { sendEmailQueueManager } from '../utils/queueManager.js';




export const createOrder = async (req, res) => {
    const {

        address_id,
        address_title,
        customer_name,
        customer_email,
        customer_phone_country_code,
        customer_phone,
        address_line_1,
        address_line_2,
        flat_villa,
        is_new_address,
        zip_code,
        contactless_delivery,
        delivery_remark,
        payment_method,
        shipping_method,
        orderItems,
    } = req.body;

    // console.log(req.body);

    const customerId = req.user.userId;
    // const customerId = 85;

    try {

        const schema = Joi.object({
            customer_name: Joi.string().required().label("Customer Name"),
            customer_email: Joi.string().email().required().label("Customer Email"),
            customer_phone_country_code: Joi.number().required().label("Country Code"),
            customer_phone: Joi.string().required().label("Customer Phone"),
            address_line_1: Joi.string().required().label("Address Line"),
            flat_villa: Joi.string().required().label("Flat/Villa"),
            zip_code: Joi.string().required().label("Zip Code"),
            payment_method: Joi.string().required().label("Payment Method"),
            shipping_method: Joi.string().required().label("Shipping Method"),
        });


        if (!req.session.cart) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Cart is empty',
            })
        }

        let orderData = {

        }

        // If it's a new address, insert the new address into the database
        if (is_new_address) {

            const validate_data = {
                customer_name,
                customer_email,
                customer_phone_country_code,
                customer_phone,
                address_line_1,
                flat_villa,
                zip_code,
                payment_method,
                shipping_method,
            };

            orderData = {
                address_id: null,
                address_title,
                customer_name,
                customer_email,
                customer_phone_country_code,
                customer_phone,
                address_line_1,
                address_line_2,
                flat_villa,
                zip_code,
                payment_method,
                shipping_method,
                orderItems,
            }

            const { error } = schema.validate(validate_data, joiOptions);
            if (error) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Validation Error",
                    error: getErrorsInArray(error?.details),
                });
            };

            // Insert the new address into the database
            const insertedAddressId = await insertNewAddressIntoDatabase(
                customerId,
                address_line_1,
                address_line_2,
                flat_villa,
                customer_name,
                customer_phone_country_code,
                customer_phone,
                contactless_delivery,
                delivery_remark,
                zip_code,
                address_title,
            );
            orderData.address_id = insertedAddressId; // Assign the new address ID
        } else {

            if (!address_id) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Please choose an address",
                });
            }

            const existingAddress = await getUserAddress(address_id);

            if (!existingAddress) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Invalid address ID",
                })
            }


            orderData = {
                address_id: address_id,
                address_title: existingAddress.address_title,
                customer_name: existingAddress.full_name,
                customer_email: existingAddress.customer_email,
                customer_phone_country_code: existingAddress.mobile_country_code,
                customer_phone: existingAddress.mobile_number,
                address_line_1: existingAddress.address_line_1,
                address_line_2: existingAddress.address_line_2,
                flat_villa: existingAddress.flat_villa,
                zip_code: existingAddress.zip_code,
                payment_method,
                shipping_method,
                orderItems,
            }


            // Use the selected existing address ID
            // orderData.address_id = address_id;
        }


        // Create order data
        const newOrder = await createUserOrder(customerId, orderData);
        // Create order items
        await createOrderItems(newOrder[0].id, orderItems);


        // send email queue
        await sendEmailQueueManager(newOrder);






        res.status(200).json({
            status: 200,
            success: true,
            message: "Successfully created order",
            result: newOrder
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

        const order_status_id = req.query.order_status_id === "null" ? null : req.query.order_status_id;
        const search_query = req.query.search_query === "null" ? null : req.query.search_query;
        let order_date = req.query.order_date === "null" ? null : req.query.order_date;

        if (order_date !== null) {
            order_date = new Date(order_date);
        }

        const orders = await getAllUserOrders(order_status_id, search_query);

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







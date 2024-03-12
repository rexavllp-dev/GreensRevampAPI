import db from '../../config/dbConfig.js';
import Joi from 'joi';
import { joiOptions } from '../helpers/joiOptions.js';
import getErrorsInArray from '../helpers/getErrors.js';

import { createOrderItems, createUserOrder, getAOrder, getAOrderData, getAllUserOrders, insertNewAddressIntoDatabase, updateAnOrder, updateInventoryQty, updateStockHistoryWhenOrder, getDashboardOrders, assignPicker, getAssinedOrders, verifyItem, assignDriver, ordersByDriver, addARemarks } from "../models/orderModel.js";
import { getUserAddress } from '../models/addressModel.js';
import { sendEmailQueueManager } from '../utils/queueManager.js';
import { getProductInventoryById, updateInventory } from '../models/inventoryModel.js';
import { getUserDashboardOrders } from '../models/userOrderDashboardModel.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import { sendOrderInvoices } from '../utils/emailer.js';


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
    console.log(orderItems);

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


        // if (!req.session.cart) {
        //     return res.status(400).json({
        //         status: 400,
        //         success: false,
        //         message: 'Cart is empty',
        //     })
        // };

        let orderData = {}

        const trx = await db.transaction(); // Start a transaction

        try {

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
                    address_id: is_new_address ? null : address_id,
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
                    trx,
                    customerId,
                    address_line_1,
                    address_line_2,
                    flat_villa,
                    customer_name,
                    customer_email,
                    customer_phone_country_code,
                    customer_phone,
                    contactless_delivery,
                    delivery_remark,
                    zip_code,
                    address_title,
                );
                console.log(insertedAddressId);

                orderData.address_id = insertedAddressId?.id; // Assign the new address ID

                console.log(insertedAddressId?.id);

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
                    customer_email: existingAddress.address_email,
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
            const newOrder = await createUserOrder(trx, customerId, orderData);
            // Create order items
            const newOrderItems = await createOrderItems(trx, newOrder[0].id, orderItems);


            newOrder[0].orderItems = newOrderItems;

            orderItems.map(async (item) => {
                const productId = item.product_id;
                const Inventory = await getProductInventoryById(productId);
                const isTrackInventory = Inventory?.inventory_management === true;
                if (isTrackInventory) {
                    let newQuantity = parseInt(Inventory.product_quantity) - parseInt(item.op_qty)
                    await updateInventoryQty(trx, productId, { product_quantity: newQuantity });
                    const comment = "Order placed"
                    const action = "reduce"
                    await updateStockHistoryWhenOrder(trx, productId, Inventory.product_quantity, item.op_qty, newQuantity, comment, action)

                }
            })

            // Commit the transaction if everything is successful
            await trx.commit();

            const getOrderData = await getAOrderData(newOrder[0].id);


            // send email queue
            await sendEmailQueueManager(getOrderData);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Successfully created order",
                result: newOrder
            });

        } catch (error) {
            // Rollback the transaction if there's an error
            await trx.rollback();
            console.error(error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to create order",
                error: error
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
};



// update order
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

// get a single order
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

// get all orders
export const getAllOrders = async (req, res) => {


    try {

        let driverId = req.query.driverId || null;
        let order_status_id = req.query.order_status_id || null;
        let search_query = req.query.search_query || null;
        let order_date = req.query.order_date || null;
        let page = req.query.page || 1;
        let perPage = req.query.perPage || 10;

        order_status_id = order_status_id === "null" ? null : order_status_id;
        search_query = search_query === "null" ? null : search_query;
        order_date = order_date === "null" ? null : order_date;
        driverId = driverId === "null" ? null : driverId;
        page = page === "null" ? 1 : parseInt(page);

        if (order_date !== null) {
            order_date = new Date(order_date);
        }

        const orders = await getAllUserOrders(order_status_id, search_query, order_date, driverId, page, perPage);

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

export const getUserDashBoardStatus = async (req, res) => {

    const userId = req.user?.userId;

    try {

        const orders = await getUserDashboardOrders(userId);


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

        })
    }
};


export const getAllDashboardOrders = async (req, res) => {

    const userId = req.body.userId;

    //console.log(userId);

    const role = req.body.role;
    const orders = await getDashboardOrders(userId, role);

    res.status(200).json({
        status: 200,
        success: true,
        message: "Fetched orders successfully",
        result: orders
    });

};


export const assignPickers = async (req, res) => {


    const orderId = req.body.orderId;
    const pickerId = req.body.pickerId;

    const pickers = await assignPicker(orderId, pickerId);

    res.status(200).json({
        status: 200,
        success: true,
        message: "Picker assigned successfully",
        result: pickers
    });

};



export const getAllAssinedOrders = async (req, res) => {

    const userId = req.body.userId;

    //console.log(userId);

    const role = req.body.role;
    const orders = await getAssinedOrders(userId, role);

    res.status(200).json({
        status: 200,
        success: true,
        message: "Fetched orders successfully",
        result: orders
    });

};


export const verifyItems = async (req, res) => {

    const orderId = req.body.orderId;
    const orders = await verifyItem(orderId);
    res.status(200).json({
        status: 200,
        success: true,
        message: "Items Verified successfully",
        result: orders
    });

};


export const assignDrivers = async (req, res) => {

    const userId = req.body.userId;
    const orderId = req.body.orderId;
    const driverId = req.body.driverId;
    const boxes = req.body.boxes;

    const drivers = await assignDriver(userId, orderId, driverId, boxes);

    res.status(200).json({
        status: 200,
        success: true,
        message: "Driver assigned successfully",
        result: drivers
    });

};


export const downloadTripsheet = async (req, res) => {


    const driverId = req.body.driverId;
    const drivers = await ordersByDriver(driverId);

    res.status(200).json({
        status: 200,
        success: true,
        message: "Tripsheet Generated Successfully",
        result: drivers
    });

};


// Admin Order details 
// add remarks

export const addRemarks = async (req, res) => {

    const remarks = req.body.ord_remarks;
    const orderId = req.params.orderId;

    try {
        const newRemarks = await addARemarks(orderId, remarks);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Added remarks successfully",
            result: newRemarks
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to add remarks",
            error: error
        });
    }
};


export const sendOrderInvoiceMailByAdmin = async (req, res) => {

    const orderId = req.params.orderId;

    try {

        const orderData = await getAOrderData(orderId);

        const pdfData = await generatePDF(orderData);

        // Send email with the PDF attachment
        await sendOrderInvoices(orderData, pdfData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Order invoice sent successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to send order invoice",
            error: error
        });
    }
};


// get invoice by admin
export const getInvoicesByAdmin = async (req, res) => {

    const orderId = req.params.orderId;

    try {

        const orderData = await getAOrderData(orderId);
        const invoiceData = await generatePDF(orderData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Order invoice generated successfully",
            result: invoiceData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to generate invoice",
            error: error
        });
    }
};
















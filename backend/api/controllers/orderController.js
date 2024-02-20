import { createAOrder, getAOrder, getOrders, updateAnOrder } from "../models/orderModel.js";



export const createOrder = async (req, res) => {

    const orderData = req.body;
    const userId = req.user.userId;

    try {

        const newOrder = await createAOrder(userId, orderData);
        console.log(newOrder);


        res.status(200).json({
            status: 200,
            success: true,
            message: "Order created successfully",
            result: newOrder
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
          status:200,
          success:true,
          message:"Fetched order successfully",
          result: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          status:500,
          success:false,
          message:"Failed to fetch order",
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

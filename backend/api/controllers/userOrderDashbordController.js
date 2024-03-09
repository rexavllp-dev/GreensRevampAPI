import { getAllUserOrders, getUserOrderDetails } from "../models/userOrderDashboardModel.js";

// get all order of a user
export const getUserOrders = async (req, res) => {

    try {
        let sort = null;
        const userId = req.user?.userId;

        if (req.query.sort !== null && req.query.sort !== undefined && req.query.sort !== 'undefined') {
            sort = req.query.sort;
        }

        const orders = await getAllUserOrders(userId, sort);


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

// user order details

export const getOrderDetails = async (req, res) => {

    const orderId = req.params.orderId;

    try {

        const order = await getUserOrderDetails(orderId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Fetched order details successfully",
            result: order
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch order details",
        })
    }
}






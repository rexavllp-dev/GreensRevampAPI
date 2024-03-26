import { getsAllCustomerOrderCount, getsAllCustomerOrderReports } from "../models/reportsModel.js";









export const getAllCustomerOrderReports = async (req, res) => {
    try {
        // Fetch all customer order reports
        const orders = await getsAllCustomerOrderReports();

        // Fetch count of orders for each customer
        const orderCounts = await getsAllCustomerOrderCount();

        // Create a map to store the total order count for each customer
        const orderCountMap = new Map();

        // Iterate through the order counts and populate the map
        orderCounts.forEach(count => {
            orderCountMap.set(count.customer_id, count.total_orders);
        });

        // Merge order counts with order reports based on customer_id
        const mergedOrders = orders.map(order => {
            const totalOrders = orderCountMap.get(order.customer_id) || 0;
            return {
                ...order,
                total_orders: totalOrders
            };
        });

        // Remove duplicate entries for the same customer_id
        const uniqueOrders = mergedOrders.filter((order, index, self) =>
            index === self.findIndex(o => o.customer_id === order.customer_id)
        );

        res.status(200).json({
            status: 200,
            success: true,
            message: "Customer order reports fetched successfully",
            result: uniqueOrders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch customer order reports",
            error: error
        });
    }
};


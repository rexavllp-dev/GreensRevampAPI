import { getsAllCustomerOrderCount, getsAllCustomerOrderReports } from "../models/reportsModel.js";




export const getAllCustomerOrderReports = async (req, res) => {
    try {
       
        const orders = await getsAllCustomerOrderReports();

        
        const orderCounts = await getsAllCustomerOrderCount();

        // store the total order count for each customer
        const orderCountMap = new Map();

        //  order counts and populate the map
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




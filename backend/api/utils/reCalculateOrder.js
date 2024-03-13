import { getOrderItems } from "../models/cancelOrdersModel.js";

export const reCalculateOrder = async (orderId) => {
    
    const orderItems = await getOrderItems(orderId);


    console.log(orderItems);
    
}
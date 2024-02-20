import express from "express";
import { createOrder, getASingleOrder, getAllOrders, updateOrder } from "../controllers/orderController.js";
import verifyToken from "../middleware/verifyToken.js";



const router = express.Router();

// create orders
router.post('/create-order', verifyToken, createOrder);

// update orders
router.put('/update-order/:orderId', updateOrder);

// get single order
router.get('/get-order/:orderId', getASingleOrder);

// get all orders
router.get('/get-all-orders', getAllOrders);



export default router;


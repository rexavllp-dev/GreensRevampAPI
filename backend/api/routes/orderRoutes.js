import express from "express";
import { createOrder, getASingleOrder, getAllOrders, updateOrder, getAllDashboardOrders, assignPickers, getAllAssinedOrders, verifyItems, assignDrivers, downloadTripsheet } from "../controllers/orderController.js";
import verifyToken from "../middleware/verifyToken.js";
import { getOrderDetails, getUserOrders } from "../controllers/userOrderDashbordController.js";




const router = express.Router();

// create orders
router.post('/create_order', verifyToken, createOrder);
// router.post('/create_order', createOrder);

// update orders
router.put('/update-order/:orderId', updateOrder);

// get single order
router.get('/get-order/:orderId', getASingleOrder);

// get all orders
router.get('/get-all-orders', getAllOrders);


// user order details
router.get('/get-order-details/:orderId', verifyToken, getOrderDetails);

// get all orders of a user
router.get('/get-user-orders', verifyToken, getUserOrders);

// get all orders by dashboard
router.post('/get-dashboard-orders', getAllDashboardOrders);


router.post('/assignpicker', assignPickers);

router.post('/get-assigned-orders', getAllAssinedOrders);

router.post('/verify-item', verifyItems);

router.post('/assigndriver', assignDrivers);

router.post('/download_tripsheet', downloadTripsheet);


export default router;


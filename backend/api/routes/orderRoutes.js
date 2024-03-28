import express from "express";
import { createOrder, getASingleOrder, getAllOrders, updateOrder, getAllDashboardOrders, assignPickers, getAllAssinedOrders, verifyItems, assignDrivers, downloadTripsheet, addRemarks, sendOrderInvoiceMailByAdmin, getInvoicesByAdmin, updateOrderItemQty, getOrderItem, getAllOrderItems } from "../controllers/orderController.js";
import verifyToken from "../middleware/verifyToken.js";
import { getOrderDetails, getUserOrders } from "../controllers/userOrderDashbordController.js";
import { getCancelledOrders } from "../controllers/cancelOrderController.js";
import { cancelIndividualItemsByAdmin, createCancelOrdersByAdmin } from "../controllers/cancelOrderController.js";


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

//get single order item
router.get('/order-item/:orderItemId', getOrderItem);

//get all order items
router.get('/all-order-items/:orderId', getAllOrderItems);


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



// admin order details
// add remarks by admin
router.put('/add_remarks/:orderId', addRemarks);

// send mail by admin for order invoices
router.post('/send_order_invoices/:orderId', sendOrderInvoiceMailByAdmin);

// get invoice by admin
router.get('/get_invoice/:orderId', getInvoicesByAdmin);

// update order item qty  by admin
router.put('/update_order_item_qty', updateOrderItemQty);

//get cancelled orders
router.get('/cancelled-orders', verifyToken, getCancelledOrders)


// cancel order by admin
router.post('/cancel-order', createCancelOrdersByAdmin);

// cancel individual order
router.post('/cancel-individual-order', cancelIndividualItemsByAdmin);




export default router;


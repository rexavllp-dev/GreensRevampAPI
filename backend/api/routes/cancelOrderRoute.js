import express from 'express';
import { cancelIndividualItems, createCancelOrders, getOrderItem } from '../controllers/cancelOrderController.js';


const router = express.Router();

//  cancel order with order id 
router.post('/cancel-order', createCancelOrders);

// cancel individual order
router.post('/cancel-individual-order', cancelIndividualItems);

// get all order item
router.get('/all-order-items/:orderId', getOrderItem);


export default router;
import express from 'express';
import { cancelIndividualItems, createCancelOrders } from '../controllers/cancelOrderController.js';


const router = express.Router();

//  cancel order with order id 
router.post('/cancel-order', createCancelOrders);

// cancel individual order
router.post('/cancel-individual-order/:product_id', cancelIndividualItems);



export default router;
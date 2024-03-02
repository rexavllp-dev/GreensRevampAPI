import { joiOptions } from '../helpers/joiOptions.js';
import stripe from 'stripe';
import { createTransaction } from './transactionController.js';
import { calculatePrice } from '../helpers/calculatePrice.js';
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
import { updateAnOrder } from "../models/orderModel.js";
import { createATransaction, findTransaction } from '../models/transactionModel.js';

export const handlePaymentRequest = async (req, res) => {

    try {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp (seconds since epoch)
        const expirationTimestamp = currentTime + (30 * 60); // 30 minutes from now
        // const collectable_amount = 1000; // Amount need to be collected
        const orderID = req.body.order_id;

        if (!orderID) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Order ID is required',
            })
        }

        let data = null;

        if (!req.session.cart) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Cart is empty',
            })
        }
        data = await calculatePrice({ session: req.session });
        let grandTotal = data?.totals?.grandTotal;

        const createPrice = async function (amount, orderID) {
            const price = await stripeInstance.prices.create({
                currency: 'aed',
                unit_amount: (amount * 100),
                product_data: {
                    name: 'Greens Order ' + orderID,
                },
            });
            return price;
        };

        const price = await createPrice(grandTotal, orderID);

        const session = await stripeInstance.checkout.sessions.create({

            success_url: 'http://localhost:3000/checkout/success?od=' + orderID,
            cancel_url: 'http://localhost:3000/checkout/failed?od=' + orderID,
            customer_email: 'test@test.com',
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            metadata: {
                order_id: orderID
            },
            expires_at: expirationTimestamp,
            mode: 'payment',
            currency: 'AED'
        });

        const updateSessionId = await updateAnOrder(orderID, { session_id: session.id });

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Success',
            url: session.url, id: session.id
        });

    } catch (error) {

        console.error('Error handling payment request:', error);
        res.status(500).json({ error: 'An error occurred while processing your payment request.' });
    }
};



export const handlePaymentRequestCompletion = async (req, res) => {

    try {

        const sessionId = req.body.stripe_session_id;
        const orderId = req.body.order_id;


        const lineItems = await stripeInstance.checkout.sessions.listLineItems(sessionId);
        console.log(lineItems.data[0].price.id);
        const stripeTransactionId = lineItems.data[0].price.id;

        const isTransactionExist = await findTransaction({ order_id: orderId });
        console.log(isTransactionExist)

        if (isTransactionExist?.length) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Transaction already exist",
                result: isTransactionExist
            });
        }

        const transaction = await createATransaction({ order_id: orderId, stripe_transaction_id: stripeTransactionId });

        res.status(200).json({
            status: 200,
            success: true,
            message: "Success",
            result: transaction
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed something went wrong",
            error: error
        });

    }
};
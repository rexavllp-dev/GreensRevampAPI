import { joiOptions } from '../helpers/joiOptions.js';
import stripe from 'stripe';
import { createTransaction } from './transactionController.js';
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const handlePaymentRequest = async (req, res) => {


    const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp (seconds since epoch)
    const expirationTimestamp = currentTime + (30 * 60); // 30 minutes from now
    const collectable_amount = 1000; // Amount need to be collected
    const orderID = req.body.order_id;

    try {

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

        const price = await createPrice(collectable_amount, orderID);

        const session = await stripeInstance.checkout.sessions.create({

            success_url: 'http://localhost:5002/payment_success?od=' + orderID,
            cancel_url: 'http://localhost:5002/payment_cancel?od=' + orderID,
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

        res.json({ url: session.url });

    } catch (error) {

        console.error('Error handling payment request:', error);
        res.status(500).json({ error: 'An error occurred while processing your payment request.' });
    }
};



export const handlePaymentRequestCompletion = async (req, res) => {

    const sessionId = req.body.stripe_session_id;
    const { orderId, transactionId } = req.body;
 

    console.log(sessionId);

    try {

        const lineItems = await stripeInstance.checkout.sessions.listLineItems(sessionId);
        console.log(lineItems.data[0].price.id);

        const transaction = await createTransaction({ orderId, transactionId });


        res.status(200).json({
            status: 200,
            success: true,
            message: "Success",
            result: transaction
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
          status:500,
          success:false,
          message:"Failed something went wrong",
          error: error
        });

    }
};
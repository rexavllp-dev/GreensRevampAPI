import { getProductById } from "../models/productModel.js";
import { getVat } from "../models/productPriceModel.js";


const calculateTotalCharges = async (cart, isStorePickup, isCod) => {

    try {


        let totalCharge = 0;

        // add shipping charge only if totalProduct price is less than 100

        const totalProductPrice = cart.reduce((total, cartItem) => {
            const itemTotalPrice = parseFloat(cartItem.totalPrice);

            if (isNaN(itemTotalPrice)) {
                console.error('Invalid totalPrice for cart item:', cartItem);
            } else {
                total += itemTotalPrice;
            }

            return total;
        }, 0);

        console.log('Total Product Price:', totalProductPrice);

        const vat = await getVat();
        const taxRate = vat.vat / 100;

        const totalProductPriceWithVat = totalProductPrice + (totalProductPrice * taxRate);

        console.log('Total Product Price with VAT:', totalProductPriceWithVat);

        if (!isStorePickup && totalProductPriceWithVat < 100) {
            totalCharge += 30;
        }

        // Add the total charge only if isStorePickup is true and totalProductPrice is less than 50

        if (isStorePickup && totalProductPriceWithVat < 50) {
            totalCharge += 10;
        }

        // Add cod charge 

        if (isCod) {
            totalCharge += 15;
        }

        console.log('Total Charge:', totalCharge);

        return totalCharge;
    } catch (error) {
        console.error(error);
        return NaN;
    }
}


const priceVerificationMiddleware = async (req, res, next) => {
    try {
        const cart = req.session.cart || [];

        // Fetch the product details for each item in the cart
        const productDetails = await Promise.all(cart.map(async (cartProduct) => {
            const product = await getProductById(cartProduct.productId);
            if (product) {
                return {
                    productId: product.id,
                    productName: product.prd_name,
                    productPrice: product.product_price,
                    productStatus: product.prd_status,
                    stockAvailability: product.stock_availability,
                    maxQuantity: product.max_qty,
                    productQuantity: product.product_quantity,
                };
            }
        }));

        console.log("Cart Product Prices:", cart.map(item => item.price));
        console.log("Product Details Prices:", productDetails.map(item => item.productPrice));
        


        // Verify each item's price and other conditions in the cart against the product details in the database
        const verificationResults = productDetails.map((productDetails, index) => {
            const cartProduct = cart[index];

            // Additional conditions for verification

            
            if (productDetails.productPrice !== cartProduct.price) {

                console.log("Type of productDetails.productPrice:", typeof productDetails.productPrice);
                console.log("Type of cartProduct.price:", typeof cartProduct.price);
                console.log("Product Details Price:", productDetails.productPrice);

                return {
                    status: 400,
                    success: false,
                    message: 'Product price verification failed. Please check product details and try again.',
                };

            }

            if (productDetails.productStatus !== true) {
                return {
                    status: 400,
                    success: false,
                    message: 'Product is not active. Please check product details and try again.',
                };
            }

            if (productDetails.stockAvailability === 'Out of stock') {
                return {
                    status: 400,
                    success: false,
                    message: 'Product is out of stock. Please check product details and try again.',
                };
            }

            if (productDetails.maxQuantity < parseInt(cartProduct.quantity)) {
                return {
                    status: 400,
                    success: false,
                    message: 'Max quantity exceeded. Please check product details and try again.',
                };
            }

            if (productDetails.productQuantity < parseInt(cartProduct.quantity)) {
                return {
                    status: 400,
                    success: false,
                    message: 'Product quantity exceeded. Please check product details and try again.',
                };
            }

            return null; // Indicates the verification passed for this item
        });

        // Find the first failed verification and return its response, or proceed to the next middleware
        const firstFailedVerification = verificationResults.find(result => result !== null);
        if (firstFailedVerification) {
            res.status(firstFailedVerification.status).json(firstFailedVerification);
        } else {

            // verify total price

            const totalCharges = await calculateTotalCharges(cart, req.session.isStorePickup, req.session.isCod);

            // console.log("Total Charges Calculated:", totalCharges);
            const storedTotalCharges = parseFloat(req.session.totalCharges)

            if (totalCharges !== storedTotalCharges) {

                req.session.totalCharges = totalCharges;

                console.log(storedTotalCharges, totalCharges);

                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Charges verification failed. Please check charges and try again.',
                });
                return; // Return to avoid proceeding to the next middleware

            }


            res.status(200).json({
                status: 200,
                success: true,
                message: 'Price verification successful. Proceed to checkout.',
            });

            next(); // Proceed to the next middleware or route handler
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error',
        });
    }
};


export default priceVerificationMiddleware;


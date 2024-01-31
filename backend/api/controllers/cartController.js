import { createHmac } from "crypto";
import { addToCart, getCart, getProductId, removeCartItem, updateCartItemQuantity } from "../models/cartModel.js";
import { calculatePrice } from "../helpers/calculatePrice.js";
// add product to the session cart and save it in the session
export const addProductToCart = async (req, res) => {

    const { productId, quantity } = req.body;

    // console.log(req.session);

    // console.log(productId, quantity);

    try {

        // await addToCart(req.session, productId, quantity);

        if (!req.session.cart) {
            req.session.cart = [];
        }

        if (req.session.cart.find(item => item.productId === productId)) {

            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Product already exists in cart',
                result: req.session.cart.find(item => item.productId === productId)
            })
        }
        req.session.cart.push({ productId, quantity });

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product added to cart successfully',
            result: req.session.cart,
            connectSid: req.sessionID
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to add product to cart. Please try again later.',
        })
    }


}


// update item quantity in express session

export const updateProductCartQuantity = async (req, res) => {
    const { productId, newQuantity, operator } = req.body;
    console.log(req.session);

    try {
        // await updateCartItemQuantity(req.session, productId, newQuantity);
        if (req.session.cart) {
            req.session.cart = req.session.cart.map(item => {
                if (item.productId === productId) {
                    if (operator === 'add') {
                        item.quantity += 1;
                    } else {
                        if (item.quantity <= 1) { return item }
                        item.quantity -= 1;
                    }
                }
                return item;
            })
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product quantity updated successfully',
            result: req.session.cart
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to update product quantity. Please try again later.',
        })
    }

}


// get cart from express session

export const getProductFromCart = async (req, res) => {

    try {
        // const cart = await getCart(req.session);
        console.log(await calculatePrice({ session: req.session }));

        if (req.session.cart) {
            const cart = req.session.cart;
            // cart.map(item => item.price = (item.price * parseInt(item.quantity))*0.05);


            // for loop to fetch data of products from products collection

            for (let i = 0; i < cart.length; i++) {

                const productId = cart[i].productId;

                const product = await getProductId(productId);

                if (product) {
                    // console.log("Product:", product);
                    cart[i].name = product.prd_name;
                    cart[i].image = product.image_url;
                    cart[i].price = product.product_price;
                    cart[i].description = product.prd_description;

                    // Calculate the total price for each item considering quantity
                    cart[i].totalPrice = parseFloat(product.product_price) * parseInt(cart[i].quantity);

                }

            }

            // console.log("Cart:", cart);

            // Calculate subtotal without VAT
            let subtotal = cart.reduce((total, item) => total + item.totalPrice, 0);


            // Calculate VAT (5% of the subtotal)
            // const vat = subtotal * 0.05;
            // add vat of 5% to subtotal



            // add shipping fee to subtotal
            // let shippingFee = 0;
            let grandTotal = subtotal;

            // Apply reward point discount (adjust the logic as needed)
            const rewardPointDiscount = 0;
            // Implement your reward point discount logic here

            // Calculate grand total with shipping charge and reward point discount
            // let grandTotal = orderTotal + shippingFee - rewardPointDiscount;

            // Check if the order is above 100 AED for free delivery

            let shippingFee = 0;

            if (subtotal >= 100) {
                shippingFee = 0;

                grandTotal = subtotal - rewardPointDiscount;
            }


            // Calculate grand total with shipping charge and reward point discount
            grandTotal = grandTotal + shippingFee - rewardPointDiscount;

            const totalProductCount = cart.length;
            const cartData = {
                cart,
                // vat,
                subtotal,
                shippingFee,
                rewardPointDiscount,
                grandTotal,
                totalProductCount

            }
            return res.status(200).json({
                status: 200,
                success: true,
                result: cartData,
                message: 'Cart retrieved successfully',
            })
        } else {
            return res.status(200).json({
                status: 200,
                success: true,
                result: [],
                message: 'Cart is empty',
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to get cart. Please try again later.',
        })
    }

}

// remove item from express session

export const removeProductFromCart = async (req, res) => {

    const { productId } = req.params;

    console.log(typeof productId)

    try {

        // const removedProduct = await removeCartItem(req.session, productId);
        let cart;
        if (req.session.cart) {
            console.log(req.session.cart);
            cart = req.session.cart.filter((cartItem) => parseInt(cartItem.productId) !== parseInt(productId));
        }

        req.session.cart = cart;

        res.status(200).json({

            status: 200,
            success: true,
            message: 'Product removed from cart successfully',
            result: req.session.cart
        })

    } catch (error) {

        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to remove product from cart. Please try again later.',
        })

    }
}








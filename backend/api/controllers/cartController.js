import { createHmac } from "crypto";
import { addToCart, getCart, getProductId, removeCartItem, updateCartItemQuantity } from "../models/cartModel.js";
// add product to the session cart and save it in the session
export const addProductToCart = async (req, res) => {

    const { productId, quantity, price } = req.body;

    console.log(req.session);

    console.log(productId, quantity, price);



    try {

        // await addToCart(req.session, productId, quantity, price);

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
        req.session.cart.push({ productId, quantity, price });

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product added to cart successfully',
            result: req.session.cart

        })

    } catch (error) {

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


    const { productId, newQuantity } = req.body;

    console.log(req.session);

    try {

        // await updateCartItemQuantity(req.session, productId, newQuantity);

        if (req.session.cart) {
            req.session.cart = req.session.cart.map(item => {
                if (item.productId === productId) {
                    item.quantity += newQuantity;
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

        if (req.session.cart) {
            const cart = req.session.cart;
            // cart.map(item => item.price = (item.price * item.quantity)*0.05);


            // for loop to fetch data of products from products collection

            for (let i = 0; i < cart.length; i++) {

                const productId = cart[i].productId;

                const product = await getProductId(productId);

                if (product) {
                    console.log("Product:", product);
                    cart[i].name = product.prd_name;
                    cart[i].image = product.image_url;
                    cart[i].price = product.product_price;
                    cart[i].description = product.prd_description;

                    // Calculate the total price for each item considering quantity
                    cart[i].totalPrice = parseFloat(product.product_price) * parseInt(cart[i].quantity);

                }

            }

            console.log("Cart:", cart);

            // Calculate subtotal without VAT
            let subtotal = cart.reduce((total, item) => total + item.totalPrice, 0);


            // Calculate VAT (5% of the subtotal)
            const vat = subtotal * 0.05;
            // add vat of 5% to subtotal
            subtotal = subtotal + vat;
            const totalProductCount = cart.length;
            const cartData = {
                cart,
                vat,
                subtotal,
                totalProductCount

            }
            return res.status(200).json({
                status: 200,
                success: true,
                result: cartData,
                message: 'Cart retrieved successfully',
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
            cart = req.session.cart.filter((cartItem) => cartItem.productId !== parseInt(productId));
        }

        req.session.cart = cart;

        res.status(200).json({

            status: 200,
            success: true,
            message: 'Product removed from cart successfully',
            result: req.session.cart
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({

            status: 500,
            success: false,
            error: error,
            message: 'Failed to remove product from cart. Please try again later.',
        })

    }
}








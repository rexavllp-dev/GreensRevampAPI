import { calculatePrice } from "../helpers/calculatePrice.js";
import { getProductById } from "../models/productModel.js";

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
        const existingProduct = req.session.cart.find(item => item.productId === productId);

        if (existingProduct) {
            // If the product already exists, increase the quantity instead of returning an error
            existingProduct.quantity += parseInt(quantity);

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Product quantity updated in cart successfully',
                result: req.session.cart
            });
        } else {

            // Check if the product is active
             const product = await getProductById(productId);

            //  min quantity

            if(product.min_qty > parseInt(quantity)) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Min quantity not met',
                    result: req.session.cart
                });
            }



            if(product.max_qty <= parseInt(quantity)) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Max quantity exceeded',
                    result: req.session.cart
                });

                
            }

            if(product.product_quantity <= parseInt(quantity)) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Product quantity exceeded',
                    result: req.session.cart
                });
            }

            // check product status

            if(product.prd_status === false) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Product is not active',
                    result: req.session.cart
                });
            }

            // check product stock availability

            if(product.stock_availability === 'Out of stock') {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Product is out of stock',
                    result: req.session.cart
                });
            }


            // If the product doesn't exist, add it to the cart
            req.session.cart.push({ productId, quantity });

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Product added to cart successfully',
                result: req.session.cart
            });
        }

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
    // console.log(req.session);

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



export const getProductFromCart = async (req, res) => {

    let data = null;

    try {

        if (req.session.cart) {
            data = await calculatePrice({ session: req.session });

            return res.status(200).json({
                status: 200,
                success: true,
                result: data,
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








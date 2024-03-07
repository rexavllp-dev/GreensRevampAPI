import { calculatePrice } from "../helpers/calculatePrice.js";
import { getBulkQuantity, getProductById } from "../models/productModel.js";


// add product to the session cart and save it in the session
export const addProductToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    // console.log(req.session);
    req.session.isStorePickup = false;
    req.session.isCod = false;
    req.session.coupons = [];
    req.session.coupon_discount = {
        discount: 0,
        is_free_shipping: false
    };
    // console.log(productId, quantity);
    try {
        // await addToCart(req.session, productId, quantity);
        const product = await getProductById(productId);
        if (!req.session.cart) {
            req.session.cart = [];
        }
        const existingProduct = req.session.cart.find(item => parseInt(item.productId) === parseInt(productId));
        if (existingProduct) {
            const productPrice = parseFloat(product.product_price);
            // existingProduct.quantity += parseInt(quantity);
            // existingProduct.price = product.product_price;
            const newAddedQuantity = parseInt(quantity) + parseInt(existingProduct.quantity);
            const newAddedPrice = product.product_price;
            // Check if the product is active
            if (product.inventory_management === true) {
                if (product.max_qty < parseInt(newAddedQuantity)) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Max quantity exceeded',
                        result: req.session.cart
                    });
                }
                if (product.product_quantity < parseInt(newAddedQuantity)) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Product quantity exceeded',
                        result: req.session.cart
                    });
                }
                // check product status
                if (product.prd_status === false) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Product is not active',
                        result: req.session.cart
                    });
                }
                // check product stock availability
                if (product.stock_availability === 'Out of stock') {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Product is out of stock',
                        result: req.session.cart
                    });
                }
                // check bulk price 
                // if (product.quantity < parseInt(quantity)) {
                //     return res.status(400).json({
                //         status: 400,
                //         success: false,
                //         message: 'max bulk quantity exceeded approved by admin',
                //     })

                // }
            }
            // if (product.quantity < parseInt(quantity)) {
            //     return res.status(400).json({
            //         status: 400,
            //         success: false,
            //         message: 'max bulk quantity exceeded approved by admin',
            //     })

            // }
            if (product.max_qty < parseInt(newAddedQuantity)) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Max quantity exceeded',
                    result: req.session.cart
                });
            }
            // check product status
            if (product.prd_status === false) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Product is not active',
                    result: req.session.cart
                });
            }
            // check product stock availability
            if (product.stock_availability === 'Out of stock') {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Product is out of stock',
                    result: req.session.cart
                });
            }
            // existingProduct.quantity += parseInt(quantity);
            // existingProduct.price = product.product_price;
            existingProduct.quantity += newAddedQuantity;
            existingProduct.price = newAddedPrice;
            // If the product already exists, increase the quantity instead of returning an error
            // existingProduct.quantity += parseInt(quantity);
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Product quantity updated in cart successfully',
                result: req.session.cart
            });
        } else {
            // Check if the product is active
            if (product.inventory_management === true) {
                if (product.max_qty < parseInt(quantity)) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Max quantity exceeded',
                        result: req.session.cart
                    });
                }
                if (product.product_quantity < parseInt(quantity)) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Product quantity exceeded',
                        result: req.session.cart
                    });
                }
                // check product status
                if (product.prd_status === false) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Product is not active',
                        result: req.session.cart
                    });
                }
                // check product stock availability
                if (product.stock_availability === 'Out of stock') {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Product is out of stock',
                        result: req.session.cart
                    });
                }
                // check bulk price
                // if (product.quantity < parseInt(quantity)) {
                //     return res.status(400).json({
                //         status: 400,
                //         success: false,
                //         message: 'max bulk quantity exceeded approved by admin',
                //     })

                // }
            }
            // if (product.quantity < parseInt(quantity)) {
            //     return res.status(400).json({
            //         status: 400,
            //         success: false,
            //         message: 'max bulk quantity exceeded approved by admin',
            //     })

            // }
            if (product.max_qty < parseInt(quantity)) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Max quantity exceeded',
                    result: req.session.cart
                });
            }
            // check product status
            if (product.prd_status === false) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Product is not active',
                    result: req.session.cart
                });
            }
            // check product stock availability
            if (product.stock_availability === 'Out of stock') {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Product is out of stock',
                    result: req.session.cart
                });
            }
            // If the product doesn't exist, add it to the cart
            req.session.cart.push({
                productId,
                quantity,
                price: product.product_price, // Set the price 
            });
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
// update product quantity
export const updateProductCartQuantity = async (req, res) => {
    const { productId, newQuantity, operator } = req.body;
    try {
        // Check if the product is active
        const product = await getProductById(productId);
        if (!product) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Product not found',
            });
        }
        if (req.session.cart) {
            let index = req.session.cart.findIndex(item => parseInt(item.productId) === parseInt(productId));
            if (index !== -1) {
                let updatedCart = req.session.cart[index];
                // Calculate total quantity based on the operator
                let totalQuantity;
                if (operator === 'add') {
                    totalQuantity = parseInt(newQuantity) + parseInt(updatedCart.quantity);
                } else if (operator === 'reduce') {
                    // Ensure quantity doesn't go below 1
                    totalQuantity = Math.max(1, updatedCart.quantity - parseInt(newQuantity));
                } else {
                    // Set the quantity directly to the newQuantity
                    totalQuantity = parseInt(newQuantity);
                }
                if (product.inventory_management === true) {
                    if (product.max_qty < totalQuantity) {
                        return res.status(400).json({
                            status: 400,
                            success: false,
                            message: 'Max quantity exceeded',
                            result: req.session.cart
                        });
                    }
                    if (product.product_quantity < totalQuantity) {
                        return res.status(400).json({
                            status: 400,
                            success: false,
                            message: 'Product quantity exceeded',
                            result: req.session.cart
                        });
                    }
                    // check product status
                    if (product.prd_status === false) {
                        return res.status(400).json({
                            status: 400,
                            success: false,
                            message: 'Product is not active',
                            result: req.session.cart
                        });
                    }
                    // check product stock availability
                    if (product.stock_availability === 'Out of stock') {
                        return res.status(400).json({
                            status: 400,
                            success: false,
                            message: 'Product is out of stock',
                            result: req.session.cart
                        });
                    }
                }
                if (product.max_qty < totalQuantity) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Max quantity exceeded',
                        result: req.session.cart
                    });
                }
                // check product status
                if (product.prd_status === false) {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Product is not active',
                        result: req.session.cart
                    });
                }
                // check product stock availability
                if (product.stock_availability === 'Out of stock') {
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Product is out of stock',
                        result: req.session.cart
                    });
                }
                // Update the quantity
                updatedCart.quantity = totalQuantity;
                // Update the cart item in the session
                req.session.cart[index] = updatedCart;
            }
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product quantity updated successfully',
            result: req.session.cart,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to update product quantity. Please try again later.',
        });
    }
};



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

    // console.log(typeof productId)

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



// API route to update isStorePickup
export const updateFlags = async (req, res) => {
    const { isStorePickup, isCod } = req.body;

    try {
        // Update session values
        if (isStorePickup !== undefined) {
            req.session.isStorePickup = isStorePickup;
        }

        if (isCod !== undefined) {
            req.session.isCod = isCod;
        }

        console.log('Updated flags:', req.session.isStorePickup, req.session.isCod);

        // Calculate price with updated isStorePickup
        const data = await calculatePrice({
            session: req.session,
            isStorePickup: req.session.isStorePickup,
            isCod: req.session.isCod,
        });

        res.status(200).json({
            status: 200,
            success: true,
            result: data,
            message: 'Cart options updated successfully',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to update . Please try again later.',
        });
    }
};


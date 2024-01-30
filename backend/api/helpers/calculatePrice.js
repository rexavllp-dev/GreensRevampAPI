import { getProductId } from "../models/cartModel.js";

export const calculatePrice = async ({
    session,
    isShipping = true,
    couponCodes = [],
    rewardPoints = 0
}) => {

    let cart = session.cart;

    for (let i = 0; i < session.cart?.length; i++) {

        const cartProduct = session.cart[i];
        const product = await getProductId(cartProduct.productId);

        if (product) {

            cart[i].name = product.prd_name;
            cart[i].image = product.image_url;
            cart[i].price = product.product_price;
            cart[i].description = product.prd_description;

            // Calculate the total price for each item considering quantity
            cart[i].totalPrice = parseFloat(product.product_price) * parseInt(cart[i].quantity);
        }
    }

    return {
        products: cart
    }

}
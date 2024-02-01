import { getProductById } from "../models/productModel.js";

export const calculatePrice = async ({
    session,
    isStorePickup = true,
    couponCodes = [],
    rewardPoints = 0,
    isCod = false,
}) => {

    let cart = session.cart || [];
    let subTotal = 0;
    let totalProductPrice = 0;

    for (let i = 0; i < cart?.length; i++) {

        const cartProduct = cart[i];
        const product = await getProductById(cartProduct.productId);
        let price = 0;

        if (product) {
            cart[i].name = product.prd_name;
            cart[i].image = product.image_url;
            cart[i].description = product.prd_description;

            // Check if bulk discount is applicable
            if (product.is_bulk_available === true) {
                const bulkOption = product.bulk_options.find(option => {
                    return option.start_range <= cartProduct.quantity && option.end_range >= cartProduct.quantity;
                });

                if (bulkOption) {
                    price = parseFloat(bulkOption.discounted_price);
                }
            }

            // If bulk discount is not applicable or not available, check for special price
            if (!price && product.special_price !== null) {
                const specialPriceType = product.special_price_type;
                const specialPriceValue = parseFloat(product.special_price);
                const offerStartDate = new Date(product.special_price_start);
                const offerEndDate = new Date(product.special_price_end);
                const currentDate = new Date();

                if (currentDate >= offerStartDate && currentDate <= offerEndDate) {
                    if (specialPriceType === 'percentage') {
                        const basePrice = parseFloat(product.product_price);
                        const discountPercentage = specialPriceValue;
                        price = basePrice - (basePrice * (discountPercentage / 100));
                    } else if (specialPriceType === 'fixed') {
                        price = parseFloat(product.product_price) - specialPriceValue;
                    }
                }
            }

            // If neither bulk discount nor special price is applicable, use the regular product price
            if (!price) {
                price = parseFloat(product.product_price);
            }

            cart[i].price = price;
            cart[i].totalPrice = price * parseInt(cart[i].quantity);
            totalProductPrice += cart[i].totalPrice;
            // Sub total is remove 5% tax from total price
            cart[i].subTotal = cart[i].totalPrice - (cart[i].totalPrice * 0.05);
            subTotal = cart[i].subTotal + subTotal;
        }
    }

      // Add store pickup charge only if isStorePickup is true and totalProductPrice is less than 50
    let storePickupCharge = 0;
    if (isStorePickup && totalProductPrice < 50) {
        storePickupCharge = 10;
    }


    // Add shipping charge only if isStorePickup is false and totalProductPrice is less than 100
    let shippingCharge = 0;
    if (!isStorePickup && totalProductPrice < 100) {
        shippingCharge = 30;
    }

    // add cod charge to the grand total
    let codCharge = 0;
    if (isCod) {
        codCharge = 15;
    }

    // Add 5 % tax to sub total 
    const taxRate = 0.05;
    const grandTotal = subTotal + (subTotal * taxRate) + shippingCharge + storePickupCharge + codCharge;
    const totalProductCount = cart.length;
    const totals = {
        subTotal: subTotal.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
        totalProductPrice : totalProductPrice.toFixed(2),
        shippingCharge: shippingCharge,
        storePickupCharge: storePickupCharge,
        codCharge: codCharge,
        totalProductCount: totalProductCount
    }

    return {
        products: cart,
        totals
    };
};

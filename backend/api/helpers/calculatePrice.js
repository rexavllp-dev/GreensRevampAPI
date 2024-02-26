import { getProductById } from "../models/productModel.js";
import { getVat } from "../models/productPriceModel.js";

export const calculatePrice = async ({
    session,
    couponCodes = [],
    rewardPoints = 0,
}) => {

    let cart = session.cart || [];
    let subTotal = 0;
    let totalProductPrice = 0;
    let totalProductPriceVat = 0;
    let priceWithVat = 0;
    let totalDiscount = 0; // Track discount for each product
    const vat = await getVat();
    let productCount = 0;
    let nonActiveProductsCount = 0;

     // Retrieve flags directly from the session
     const isStorePickup = session.isStorePickup || false;
     const isCod = session.isCod || false;


    for (let i = 0; i < cart?.length; i++) {

        const cartProduct = cart[i];
        const product = await getProductById(cartProduct.productId);

        // Check if the product is active

        let price = 0;
        let discount = 0; // Initialize discount to 0


        // Check if quantity is less than or equal to stock

        if (product) {


            if (

                product.prd_status === false ||
                product.stock_availability === 'Out of stock' &&
                cart[i].quantity <= product.product_quantity &&
                cart[i].max_quantity <= product.max_qty

            ) {
                // If the product is not in the condition, continue to the next iteration
                productCount++;
                continue;
            }

            cart[i].name = product.prd_name;
            cart[i].image = product.image_url;
            cart[i].description = product.prd_description;
            productCount++;
            nonActiveProductsCount++;
            const basePrice = parseFloat(product.product_price);

            // Check if bulk discount is applicable
            if (product.bulk_options) {
                const bulkOption = product.bulk_options?.find(option => {
                    return option.start_range <= cartProduct.quantity && option.end_range >= cartProduct.quantity;
                });

                if (bulkOption) {
                    price = parseFloat(bulkOption.discounted_price);
                    discount = basePrice - price;
                }
            }

            // If bulk discount is not applicable or not available, check for special price
            if (!price && product.special_price !== null) {
                const specialPriceType = product.special_price_type;
                const specialPriceValue = parseFloat(product.special_price);
                const offerStartDate = new Date(product.special_price_start);
                const offerEndDate = new Date(product.special_price_end);
                const currentDate = new Date();
                const isDiscount = product.is_discount;

                if (isDiscount === true && currentDate >= offerStartDate && currentDate <= offerEndDate) {
                    if (specialPriceType === 'percentage') {
                        // const basePrice = parseFloat(product.product_price);
                        const discountPercentage = specialPriceValue;
                        price = basePrice - (basePrice * (discountPercentage / 100));
                        discount = basePrice - price;
                    } else if (specialPriceType === 'fixed') {
                        price = basePrice - specialPriceValue;
                        discount = specialPriceValue;
                    }
                }
            }

            // If neither bulk discount nor special price is applicable, use the regular product price
            if (!price) {
                price = basePrice;
            }

            // Apply VAT to regular and special prices if within the offer period
            const vatPercentage = vat.vat / 100;
            price = price
            cart[i].price = price;
            cart[i].priceVat = price + (price * vatPercentage);
            cart[i].totalPrice = price * parseInt(cart[i].quantity);
            cart[i].totalPriceWithVat = price * parseInt(cart[i].quantity) + (price * vatPercentage);
            totalProductPrice += cart[i].totalPrice;
            totalProductPriceVat += cart[i].totalPriceWithVat;

            // Track total discount for all products
            totalDiscount += discount * parseInt(cart[i].quantity);
            cart[i].subTotal = basePrice * parseInt(cart[i].quantity);
            subTotal += cart[i].subTotal;

        }
    }

    // Add store pickup charge only if isStorePickup is true and totalProductPrice is less than 50
    let storePickupCharge = 0;
    if (isStorePickup && totalProductPrice < 50) {
        nonActiveProductsCount === 0 ? 0 : storePickupCharge = 10;
    }

    // Add shipping charge only if isStorePickup is false and totalProductPrice is less than 100
    let shippingCharge = 0;
    if (!isStorePickup && totalProductPrice < 100) {
        nonActiveProductsCount === 0 ? 0 : shippingCharge = 30;
    }

    // Add cod charge to the grand total
    let codCharge = 0;
    if (isCod) {
        nonActiveProductsCount === 0 ? 0 : codCharge = 15;
    }

    // Add 5 % tax to sub total 
    const taxRate = vat.vat / 100;

    // Calculate total product price with VAT


    const taxPrice = (totalProductPrice * taxRate)
    const totalProductCount = productCount;
    const totalProductVAT = (parseFloat(subTotal) - parseFloat(totalDiscount)) * (vat.vat / 100);

    // Grand Total formula =((sub total-Discount)+Service charges+Delivery charge))+vat 5%
    const grandTotalWithVAT = nonActiveProductsCount === 0 ? 0 : ((subTotal - totalDiscount) + shippingCharge + codCharge + storePickupCharge) + taxPrice
    const totalProductPriceWithVAT = nonActiveProductsCount === 0 ? 0 : (subTotal - totalDiscount) + taxPrice
    const totals = {
        subTotal: subTotal.toFixed(2),
        grandTotal: grandTotalWithVAT.toFixed(2),
        totalProductPrice: totalProductPrice.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        totalProductVAT: totalProductVAT.toFixed(2),
        shippingCharge: shippingCharge,
        storePickupCharge: storePickupCharge,
        codCharge: codCharge,
        totalProductCount: totalProductCount,
        totalProductPriceWithVAT: totalProductPriceWithVAT.toFixed(2),
    }

    session.totals = totals;

    return {
        products: cart,
        totals,
        isStorePickup
    };
};

import { getProductById } from "../models/productModel.js";
import { getVat } from "../models/productPriceModel.js";

export const calculatePrice = async ({
    session,
    isStorePickup = false,
    couponCodes = [],
    rewardPoints = 0,
    isCod = false,
}) => {

    let cart = session.cart || [];
    let subTotal = 0;
    let totalProductPrice = 0;
    let totalDiscount = 0; // Track discount for each product
    const vat = await getVat();
    let activeProducts = []; // Initialize activeProducts as an array



    for (let i = 0; i < cart?.length; i++) {

        const cartProduct = cart[i];
        const product = await getProductById(cartProduct.productId);

        // Check if the product is active
        if (product && product.prd_status === true && product.stock_availability === 'In stock') {
            let price = 0;
            let discount = 0; // Initialize discount to 0

            if (product) {

                cart[i].name = product.prd_name;
                cart[i].image = product.image_url;
                cart[i].description = product.prd_description;
                const basePrice = parseFloat(product.product_price);

                // Check if bulk discount is applicable
                if (product.is_bulk_available === true) {
                    const bulkOption = product.bulk_options.find(option => {
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


                    // console.log('VAT:', vat);
                    // const vatPercentage = vat.vat / 100;
                    // console.log('VAT percentage:', vatPercentage);

                    if (isDiscount === true && currentDate >= offerStartDate && currentDate <= offerEndDate) {
                        if (specialPriceType === 'percentage') {
                            // const basePrice = parseFloat(product.product_price);
                            const discountPercentage = specialPriceValue;
                            price = basePrice - (basePrice * (discountPercentage / 100));
                            discount = basePrice - price;
                            // price = price + (price * vatPercentage);
                        } else if (specialPriceType === 'fixed') {
                            price = basePrice - specialPriceValue;
                            discount = specialPriceValue;
                            // price = price + (price * vatPercentage);
                        }
                    }
                }

                // If neither bulk discount nor special price is applicable, use the regular product price
                if (!price) {
                    price = basePrice;
                    //  parseFloat(product.product_price);
                    // price = price + (price * vatPercentage);
                }

                // Apply VAT to regular and special prices if within the offer period

                const vatPercentage = vat.vat / 100;
                price = price + (price * vatPercentage);

                cart[i].price = price;
                cart[i].totalPrice = price * parseInt(cart[i].quantity);
                totalProductPrice += cart[i].totalPrice;

                // Track total discount for all products
                totalDiscount += discount;

                // Sub total is the total price without tax
                // cart[i].subTotal = cart[i].totalPrice - (cart[i].totalPrice * vatPercentage);
                cart[i].subTotal = basePrice;
                subTotal += cart[i].subTotal;

                // Add active product to the activeProducts array
                activeProducts.push(cart[i]);

            } else {
                // If the product is not active or out of stock, set relevant information
                cart[i].isActive = false;
                cart[i].isOutOfStock = true; // Add this flag to indicate out of stock
                cart[i].name = product ? "Product Not Active" : "Out of Stock";
                cart[i].image = product ? product.image_url : "";
                cart[i].description = product ? product.prd_description : "This product is currently out of stock.";
                cart[i].price = product ? 0 : price;
                cart[i].totalPrice = product ? totalProductPrice : 0;
                cart[i].subTotal = product ? subTotal : 0;
            }
        }
    }


    if (activeProducts.length === 0) {

        return {
            products: activeProducts,
            totals: {
                subTotal: "0.00",
                grandTotal: "0.00",
                totalProductPrice: "0.00",
                totalDiscount: "0.00",
                shippingCharge: 0,
                storePickupCharge: 0,
                codCharge: 0,
                totalProductCount: 0
            }
        };
    }

    // Move the calculation of totalProductPrice outside the loop
    //  totalProductPrice = activeProducts.reduce((total, product) => total + product.totalPrice, 0);

    //  console.log('Total Product Price:', totalProductPrice);

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
    const taxRate = vat.vat / 100;
    // const grandTotal = subTotal + (subTotal * taxRate) + shippingCharge + storePickupCharge + codCharge;
    const grandTotal = subTotal + (subTotal * taxRate) + storePickupCharge + codCharge + shippingCharge - totalDiscount;
    const grandTotalWithVAT = grandTotal + (grandTotal * taxRate);

    const totalProductCount = activeProducts.length;
    const totals = {
        subTotal: subTotal.toFixed(2),
        grandTotal: grandTotalWithVAT.toFixed(2),
        totalProductPrice: totalProductPrice.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        shippingCharge: shippingCharge,
        storePickupCharge: storePickupCharge,
        codCharge: codCharge,
        totalProductCount: totalProductCount
    }



    return {
        products: activeProducts,
        totals
    };
};

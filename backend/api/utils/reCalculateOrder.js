import { getOrderItems, getUserOrders } from "../models/cancelOrdersModel.js";
import { getVat } from "../models/productPriceModel.js";

export const reCalculateOrder = async (orderId,trx,isStorePickup,isCod) => {

    const orderItems = await getOrderItems(orderId,trx);
    const userOrders = await getUserOrders(orderId,trx);
    const vat = await getVat(); // Assuming getVat function exists

    let subTotal = 0;
    let totalProductPriceVat = 0;
    let productTotal = 0;

    for (let i = 0; i < orderItems?.length; i++) {

        const vatPercentage = vat.vat / 100;
        // Check if the product is not canceled
        if (!orderItems[i].op_is_cancel === true) {
            // If not canceled, calculate the product total including quantity and add it to the subtotal and total product price with VAT
            productTotal = orderItems[i].op_actual_price * orderItems[i].op_qty;
            subTotal = productTotal;
            totalProductPriceVat += (productTotal * vatPercentage);

            console.log('subTotal', 'totalProductPriceVat',subTotal, totalProductPriceVat)


        }
    }
    // shipping charge

    console.log((productTotal < 50))

    let storePickupCharge = 0;
    if (userOrders[0].ord_shipping_method === 'Store pickup'&& (productTotal < 50)) {
        storePickupCharge = 10;
    }

    // console.log(userOrders.ord_shipping_method === 'Shipping' && (productTotal < 100));

    console.log(userOrders[0].ord_shipping_method === "Shipping")

    let shippingCharge = 0;
    if ( userOrders[0].ord_shipping_method === 'Shipping' && (productTotal < 100)) {
         shippingCharge = 30;
    }

    

    let codCharge = 0;
    if (orderItems[0].ord_payment_method === 'Cash on Delivery') {
         codCharge = 15;
    }


    // Calculate VAT for the remaining products
    const taxRate = vat.vat / 100;
    const totalProductVAT = (subTotal + totalProductPriceVat) * taxRate;

    // Calculate grand total with VAT
    const grandTotalWithVAT = subTotal +  shippingCharge + codCharge + storePickupCharge + totalProductPriceVat;

    // Update the totals object with the recalculated values
    const totals = {
        subTotal: subTotal.toFixed(2),
        grandTotal: grandTotalWithVAT,
        totalProductPrice: (subTotal + totalProductPriceVat).toFixed(2), // Including VAT
        totalProductVAT: (totalProductVAT).toFixed(2),
        storePickupCharge: storePickupCharge.toFixed(2),
        shippingCharge: shippingCharge.toFixed(2),
        codCharge: codCharge.toFixed(2)
    };

    return totals



}
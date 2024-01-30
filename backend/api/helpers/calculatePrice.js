export const calculatePrice = ({
    session
}) => {

    // Add logic to calculate the total price of the cart
    try {
        const cart = req.session.cart;
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
        };
    
        return cartData;
    
    console.log('Session:', session);
}catch (error) {

    console.log(error);
}

}
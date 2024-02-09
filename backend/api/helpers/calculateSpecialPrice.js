export const calculateSpecialPrice = (rows, vat) => {
    // Map through each row in the rows array
    const result = rows.map((row) => {
        // Retrieve the product price, special price type, special price value, offer start date, offer end date, current date, and is_discount flag from the row
        const price = parseFloat(row.product_price);
        const specialPriceType = row.special_price_type;
        const specialPriceValue = parseFloat(row.special_price);
        const offerStartDate = new Date(row.special_price_start);
        const offerEndDate = new Date(row.special_price_end);
        const currentDate = new Date();
        const isDiscount = row.is_discount;

        let specialPrice;

        // Calculate the VAT percentage based on the retrieved VAT value
        const vatPercentage = vat.vat / 100;
        console.log('VAT percentage:', vatPercentage);

        // Calculate the price with VAT by adding the VAT percentage to the product price
        const priceWithVat = price + (price * vatPercentage);
        console.log('Price with VAT:', priceWithVat);

        // Check if there is a discount and if the current date is within the offer period
        if (isDiscount === true && (currentDate >= offerStartDate) && (currentDate <= offerEndDate)) {
            if (specialPriceType === 'percentage') {
                // Calculate the discount percentage based on the special price value
                const discountPercentage = specialPriceValue;
                // Calculate the special price by subtracting the discount percentage from the product price
                specialPrice = price - (price * (discountPercentage / 100));
                // Add the VAT to the special price
                specialPrice = specialPrice + (specialPrice * vatPercentage);
            } else if (specialPriceType === 'fixed') {
                // Calculate the special price by subtracting the special price value from the product price
                specialPrice = price - specialPriceValue;
                // Add the VAT to the special price
                specialPrice = specialPrice + (specialPrice * vatPercentage);
            } else {
                console.error('Invalid discount type:', specialPriceType);
                return null; // Handle invalid discount type
            }
        } else {
            specialPrice = null; // Use the regular price if not within the offer period
        }

        // Return the row object with the calculated special price and price with VAT
        return { ...row, specialPrice, price: priceWithVat };
    });

    return result; // Return the calculated result
};
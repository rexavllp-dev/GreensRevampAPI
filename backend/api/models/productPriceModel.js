import db from '../../config/dbConfig.js';


// create price

export const createPrdPrice = async (priceData, prdStatus, prdDashboardStatus) => {
    const price = await db("products_price").insert(priceData).returning('*');

    if (prdStatus)
        // Update the products table with prd_status
        await db("products")
            .where({ id: priceData.product_id })
            .update({
                prd_status: prdStatus,
                prd_dashboard_status: prdDashboardStatus
            });

    return price;
};




// update price
export const updatePrdPrice = async (productId, priceData, prdStatus, prdDashboardStatus) => {
    const price = await db("products_price")
        .where({ product_id: productId })
        .update(priceData).returning();

    if (prdStatus !== undefined)
        // Update the products table with prd_status
        await db("products")
            .where({ id: productId })
            .update({
                prd_status: prdStatus,
                prd_dashboard_status: prdDashboardStatus
            });

    return price;
};


export const getVat = async () => {
    const vat = await db("vat").select('vat').first();
    return vat
}


// get a price
export const getPrdPrice = async (priceId) => {
    console.log(priceId)
    const vat = await db("vat").select('vat').first();

    // Select the 'price' and 'discount_type' columns, and calculate the 'special_price'
    const price = await db
        .select('product_price', 'special_price_type', 'special_price', "special_price_end", "special_price_start", "is_discount")
        .from("products_price")
        .where({ id: priceId })
        .then((rows) => {
            const result = rows.map((row) => {
                console.log(row);
                const price = parseFloat(row.product_price);
                const specialPriceType = row.special_price_type;
                const specialPriceValue = parseFloat(row.special_price);
                const offerStartDate = new Date(row.special_price_start);
                const offerEndDate = new Date(row.special_price_end);
                const currentDate = new Date();
                const isDiscount = row.is_discount; //  to retrieve is_discount

                let specialPrice;
                // Apply VAT to regular and special prices if within the offer period

                const vatPercentage = vat.vat / 100;
                console.log('VAT percentage:', vatPercentage);
                const priceWithVat = price + (price * vatPercentage);
                console.log('Price with VAT:', priceWithVat);

                if (isDiscount === true &&
                    (currentDate >= offerStartDate) &&
                    (currentDate <= offerEndDate || (currentDate.getTime() === offerEndDate.getTime()))) {
                    // console.log('Within offer period');
                    if (specialPriceType === 'percentage') {
                        const discountPercentage = specialPriceValue;
                        specialPrice = price - (price * (discountPercentage / 100));
                        specialPrice = specialPrice + (specialPrice * vatPercentage);
                    } else if (specialPriceType === 'fixed') {
                        specialPrice = price - specialPriceValue;
                        specialPrice = specialPrice + (specialPrice * vatPercentage);
                    } else {
                        console.error('Invalid discount type:', specialPriceType);
                        return null; // Handle invalid discount type
                    }
                } else {
                    specialPrice = null; // Use the regular price if not within the offer period
                }

                return { ...row, specialPrice, price: priceWithVat };
            });

            return result; // Return the calculated result
        }
        );
    return price;
}

// get all price

export const getAllPrdPrice = async () => {
    const price = await db("products_price");
    return price;
}


// delete price

export const deletePrdPrice = async (priceId) => {
    const price = await db("products_price").where({ id: priceId }).del();
    return price;
}


// get price by product id

export const getProductPriceById = async (productId) => {
    const productPrice = await db('products_price')
        .where({ product_id: productId })
        .select(
            db.raw(`
CASE 
    WHEN products_price.is_discount = 'false' THEN products_price.product_price
    WHEN products_price.is_discount = true AND CURRENT_TIMESTAMP BETWEEN DATE(products_price.special_price_start) AND DATE(products_price.special_price_end) THEN
        CASE 
            WHEN products_price.special_price_type = 'percentage' THEN products_price.product_price * (1 - (products_price.special_price / 100))
            WHEN products_price.special_price_type = 'fixed' THEN products_price.product_price - products_price.special_price
            ELSE 0
        END
    ELSE products_price.product_price
END AS computed_price
`)

        )
        .first();
    return productPrice;
}


export const updatePriceHistory = async (priceData) => {
    // console.log(priceData)
    
    const PriceHistory = db('price_history').insert(priceData).returning('*');
    return PriceHistory;
}





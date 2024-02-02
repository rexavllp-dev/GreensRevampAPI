import db from '../../config/dbConfig.js';


// create price

export const createPrdPrice = async (priceData, prdStatus) => {
    const price = await db("products_price").insert(priceData).returning('*');

    if(prdStatus)
    // Update the products table with prd_status
    await db("products")
        .where({ id: priceData.product_id })
        .update({ prd_status: prdStatus });

    return price;
};




// update price
export const updatePrdPrice = async (productId,priceData, prdStatus) => {
    const price = await db("products_price").where({ product_id: productId }).update(priceData).returning();

    if(prdStatus !== undefined)
    // Update the products table with prd_status
    await db("products")
        .where({ id: productId })
        .update({ prd_status: prdStatus });

    return price;
};



// get a price
export const getPrdPrice = async (priceId) => {
    // Select the 'price' and 'discount_type' columns, and calculate the 'special_price'
    const price = await db.select('product_price', 'special_price_type', 'special_price', "special_price_end")
        .from("products_price").where({ id: priceId })
        .then((rows) => {
            const result = rows.map((row) => {
                console.log(row);
                const price = parseFloat(row.product_price);
                const specialPriceType = row.special_price_type;
                const specialPriceValue = parseFloat(row.special_price);
                const offerStartDate = new Date(row.special_price_start);
                const offerEndDate = new Date(row.special_price_end);
                const currentDate = new Date();


                let specialPrice;

                if (currentDate >= offerStartDate && currentDate <= offerEndDate) {
                    if (specialPriceType === 'percentage') {
                        const discountPercentage = specialPriceValue;
                        specialPrice = price - (price * (discountPercentage / 100));
                    } else if (specialPriceType === 'fixed') {
                        specialPrice = price - specialPriceValue;
                    } else {
                        console.error('Invalid discount type:', specialPriceType);
                        return null; // Handle invalid discount type
                    }
                } else {
                    specialPrice = price; // Use the regular price if not within the offer period
                }

                return { ...row, specialPrice };
            });

            return result; // Return the calculated result
        }
        );
    console.log(price, "price")
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
    const product = await db('products_price')
        .select('*')
        .where({ product_id: productId })
        .first();

    return product;
}


export const updatePriceHistory = async (priceData) => {
    // console.log(priceData)
    const PriceHistory = db('price_history').insert(priceData).returning('*');
    return PriceHistory;
}





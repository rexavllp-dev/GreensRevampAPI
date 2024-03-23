import db from '../../config/dbConfig.js';
import { generateActivityLog } from '../utils/generateActivityLog.js';



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

    // await generateActivityLog({
    //     userId: updatedData?.user_id,
    //     comment: `Updated product ${updatedData?.prd_name}`
    // })

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
export const getPrdPrice = async (priceId,res) => {
    const vat = await db("vat").select('vat').first();
    // res.status(200).json({vat})

    // Select the 'price' and 'discount_type' columns, and calculate the 'special_price'
    const price = await db
        .select(
            'product_price',
            'special_price_type',
            'special_price',
            "special_price_end",
            "special_price_start",
            "is_discount",

            "brand_discounts.brand_id",
            "brand_discounts.brand_discount_name",
            "brand_discounts.brand_discount_status",
            "brand_discounts.brand_discount_start_date",
            "brand_discounts.brand_discount_end_date",
            "brand_discounts.brand_discount_type",
            "brand_discounts.brand_discount_percentage_value",

            "category_discounts.category_discount_name",
            "category_discounts.category_discount_percentage_value",
            "category_discounts.category_discount_status",
            "category_discounts.category_discount_start_date",
            "category_discounts.category_discount_end_date",
            "category_discounts.category_discount_type",
            "category_discounts.category_id",

            "products_bulks.discounted_price",
            "products_bulks.product_id",
            "products_bulks.start_range",
            "products_bulks.end_range",



            "products.prd_brand_id",
            "product_category.id",
            "product_category.category_id",

        )
        .from("products_price")
        .where({ "products_price.id": priceId })
        .leftJoin("products", "products_price.product_id", "products.id")
        .leftJoin("brand_discounts", "products.prd_brand_id", "brand_discounts.brand_id")
        .leftJoin("product_category", "products.id", "product_category.product_id")
        .leftJoin("categories", "product_category.category_id", "categories.id")
        .leftJoin("category_discounts", "categories.id", "category_discounts.category_id")
        .leftJoin("products_bulks", "products_price.product_id", "products_bulks.product_id")


        .then(async (rows) => {
            const result = await Promise.all(rows.map(async (row) => {

                const bulk_discount_price = row.discounted_price 
                const bulk_product_id = row.product_id
                const bulk_start_range = row.start_range
                const bulk_end_range = row.end_range
                


                
        

                // console.log(row);
                const price = parseFloat(row.product_price);
                const specialPriceType = row.special_price_type;
                const specialPriceValue = parseFloat(row.special_price);
                const offerStartDate = new Date(row.special_price_start);
                const offerEndDate = new Date(row.special_price_end);
                const currentDate = new Date();
                const isDiscount = row.is_discount; //  to retrieve is_discount


                let specialPrice;
                // Apply VAT to regular and special prices if within the offer period
                let uatOfferStartDate = new Date(offerStartDate);
                // Get only the date portion
                uatOfferStartDate = uatOfferStartDate.toISOString().split('T')[0];
                let uatOfferEndDate = new Date(offerEndDate);
                // Get only the date portion
                uatOfferEndDate = uatOfferEndDate.toISOString().split('T')[0];

                let uatCurrentDate = new Date(currentDate);
                uatCurrentDate = uatCurrentDate.toISOString().split('T')[0];
                const vatPercentage = vat.vat / 100;
                const priceWithVat = price + (price * vatPercentage);
                if (isDiscount === true &&
                    (uatCurrentDate >= uatOfferStartDate) && (uatCurrentDate <= uatOfferEndDate)) {
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


                // give discount to the brand or category 

                // calculation of brand discount

                const brandId = row.brand_id;
                const brand_discount_start_date = row.brand_discount_start_date;
                const brand_discount_end_date = row.brand_discount_end_date;
                const brand_discount_type = row.brand_discount_type;
                const brand_discount_percentage_value = row.brand_discount_percentage_value;
                const brand_discount_status = row.brand_discount_status;
                const currentBrandDate = new Date();

                console.log(brand_discount_start_date)
                // date format
                let brandSpecialPrice;

                let offerStartDateBrand = new Date(brand_discount_start_date);
                // Get only the date portion
                offerStartDateBrand = offerStartDateBrand?.toISOString().split('T')[0];

                let offerEndDateBrand = new Date(brand_discount_end_date);
                // Get only the date portion
                offerEndDateBrand = offerEndDateBrand.toISOString().split('T')[0];

                let currentDateBrand = new Date(currentBrandDate);
                currentDateBrand = currentDateBrand.toISOString().split('T')[0];


                if (brandId) {
                    console.log("brandId", brandId)
                    if (brand_discount_status === true &&
                        (currentDateBrand >= offerStartDateBrand) && (currentDateBrand <= offerEndDateBrand)) {

                        if (brand_discount_type === 'percentage') {
                            const discountPercentage = brand_discount_percentage_value;
                            brandSpecialPrice = price - (price * (discountPercentage / 100));
                            brandSpecialPrice = brandSpecialPrice + (brandSpecialPrice * vatPercentage);
                        } else {
                            console.error('Invalid discount type:', brand_discount_type);
                            return null; // Handle invalid discount type
                        }

                    }
                    console.log("brandSpecialPrice", brandSpecialPrice)
                }



                // calculation of category discount

                const categoryId = row.category_id;
                const category_discount_start_date = row.category_discount_start_date;
                const category_discount_end_date = row.category_discount_end_date;
                const category_discount_type = row.category_discount_type;
                const category_discount_percentage_value = row.category_discount_percentage_value;
                const category_discount_status = row.category_discount_status;
                const currentCategoryDate = new Date();
                console.log("categoryId", categoryId)

                // date format

                let offerStartDateCategory = new Date(category_discount_start_date);
                // Get only the date portion
                offerStartDateCategory = offerStartDateCategory.toISOString().split('T')[0];

                let offerEndDateCategory = new Date(category_discount_end_date);
                // Get only the date portion
                offerEndDateCategory = offerEndDateCategory.toISOString().split('T')[0];

                let currentDateCategory = new Date(currentCategoryDate);
                currentDateCategory = currentDateCategory.toISOString().split('T')[0];

                let categorySpecialPrice;

                if (categoryId) {
                    console.log("categoryId", categoryId)
                    if (category_discount_status === true &&
                        (currentDateCategory >= offerStartDateCategory) && (currentDateCategory <= offerEndDateCategory)) {

                        if (category_discount_type === 'percentage') {
                            const discountPercentage = category_discount_percentage_value;
                            categorySpecialPrice = price - (price * (discountPercentage / 100));
                            categorySpecialPrice = categorySpecialPrice + (categorySpecialPrice * vatPercentage);
                        } else {
                            console.error('Invalid discount type:', category_discount_type);
                            return null; // Handle invalid discount type
                        }
                    }

                }

                console.log("categorySpecialPrice", categorySpecialPrice)
                console.log("specialPrice", specialPrice)
                console.log("brandSpecialPrice", brandSpecialPrice)

                let priceArray = [];

                if(brandSpecialPrice !== null && brandSpecialPrice !== undefined){
                    priceArray.push(brandSpecialPrice)
                }
                if(specialPrice !== null && specialPrice !== undefined){
                    priceArray.push(specialPrice)
                }
                if(categorySpecialPrice !== null && categorySpecialPrice !== undefined){
                    priceArray.push(categorySpecialPrice)
                }

                console.log("priceArray", priceArray)

                // Filter the array to get the lowest price
                specialPrice = Math.min(...priceArray);

                // compare which is greater special price or brandSpecialPrice or categorySpecialPrice that will apply as the price if there is no discount apply the regular price

                // if ((brandSpecialPrice > specialPrice) && (brandSpecialPrice > categorySpecialPrice)) {
                //     console.log('brandSpecialPricefff:', brandSpecialPrice);
                //     specialPrice = brandSpecialPrice
                // } else if ((categorySpecialPrice > specialPrice) && (categorySpecialPrice > brandSpecialPrice)) {
                //     specialPrice = categorySpecialPrice

                // }

                console.log('specialPrice:', specialPrice);


                // Apply the special price
                return { ...row, specialPrice, price: priceWithVat };

            }));

            console.log(result);

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
        .select('*')
        .first();
    return productPrice;
}


export const updatePriceHistory = async (priceData) => {
    // console.log(priceData)
  const PriceHistory = db('price_history').insert(priceData).returning('*');
    return PriceHistory;
};






export const getBulkDiscountPriceByProductId = async (productId) => {
    const discountPrices = await db('products_bulks')
        .where({ product_id: productId })
        .select('discounted_price')


    return discountPrices.map(entry => entry.discounted_price);
};





import db from '../../config/dbConfig.js';
// create discount

export const createBrandDiscount = async (discountData) => {

    const discount = await db("brand_discounts").insert(discountData).returning('*');

    return discount;
}


// create discount with category

export const createCategoryDiscount = async (discountData) => {

    const discount = await db("category_discounts").insert(discountData).returning('*');

    return discount;
}


// get brand id  

export const getBrandById = async (brandId) => {

    const brand = await db('brand_discounts').select('*').where({ id: brandId }).first();
    return brand;
}

// get category id

export const getCategoryById = async (categoryId) => {

    const category = await db('category_discounts').select('*').where({ id: categoryId }).first();
    return category;
}

// get price 

// export const getPrdPrice = async (priceId) => {
//     const vat = await db("vat").select('vat').first();

//     // Select the 'price' and 'discount_type' columns, and calculate the 'special_price'
//     const price = await db
//         .select('product_price', 'special_price_type', 'special_price', "special_price_end", "special_price_start", "is_discount")
//         .from("products_price")
//         .where({ id: priceId })
//         .then((rows) => {
//             const result = rows.map(async(row) => {
//                 // console.log(row);
//                 const price = parseFloat(row.product_price);
//                 const specialPriceType = row.special_price_type;
//                 const specialPriceValue = parseFloat(row.special_price);
//                 const offerStartDate = new Date(row.special_price_start);
//                 const offerEndDate = new Date(row.special_price_end);
//                 const currentDate = new Date();
//                 const isDiscount = row.is_discount; //  to retrieve is_discount

//                 let specialPrice;
//                 // Apply VAT to regular and special prices if within the offer period
//                 let uatOfferStartDate = new Date(offerStartDate);
//                 // Get only the date portion
//                 uatOfferStartDate = uatOfferStartDate.toISOString().split('T')[0];
//                 let uatOfferEndDate = new Date(offerEndDate);
//                 // Get only the date portion
//                 uatOfferEndDate = uatOfferEndDate.toISOString().split('T')[0];

//                 let uatCurrentDate = new Date(currentDate);
//                 uatCurrentDate = uatCurrentDate.toISOString().split('T')[0];
//                 const vatPercentage = vat.vat / 100;
//                 const priceWithVat = price + (price * vatPercentage);
//                 if ((uatCurrentDate >= uatOfferStartDate) && (uatCurrentDate <= uatOfferEndDate)) {
//                     // console.log('Within offer period');

//                     const brandDiscount = await getBrandById(row.brand_id);

//                     if (brandDiscount && brandDiscount.brand_discount_type === 'percentage') {
//                         const discountPercentage = brandDiscount.brand_discount_percentage_value;
//                         specialPrice = price - (price * (discountPercentage / 100));
//                         specialPrice = specialPrice + (specialPrice * vatPercentage);

//                     }  else {
//                         console.error('Invalid discount type:', brandDiscount?.brand_discount_type);
//                         return null; // Handle invalid discount type
//                     }
                    
//                 } else {
//                     specialPrice = null; // Use the regular price if not within the offer period
//                 }

//                 return { ...row, specialPrice, price: priceWithVat };
//             });

//             return result; // Return the calculated result
//         }
//         );
//     return price;
// }
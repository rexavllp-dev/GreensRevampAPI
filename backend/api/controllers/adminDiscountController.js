import { createBrandDiscount, createCategoryDiscount } from "../models/adminDiscountModel.js";


// create discount
export const addDiscount = async (req, res) => {

    const discountData = req.body;
    const {is_brand} = discountData;

    try {

        if (is_brand === null) {
            console.log(is_brand);
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid request'
            })

        }
         
        let discount

        if (discountData.is_brand === true) {

            const brandData = {

                brand_id: discountData.discount_id,
                brand_discount_name: discountData.discount_name,
                brand_discount_status: discountData.discount_status,
                brand_discount_start_date: discountData.discount_start_date,
                brand_discount_end_date: discountData.discount_end_date,
                brand_discount_type: discountData.discount_type,
                brand_discount_percentage_value: discountData.discount_percentage_value
            }

         discount = await createBrandDiscount(brandData);

        } else {

            const categoryData = {
                
                category_id: discountData.discount_id,
                category_discount_name: discountData.discount_name,
                category_discount_status: discountData.discount_status,
                category_discount_start_date: discountData.discount_start_date,
                category_discount_end_date: discountData.discount_end_date,
                category_discount_type: discountData.discount_type,
                category_discount_percentage_value: discountData.discount_percentage_value
            }
            
             discount = await createCategoryDiscount(categoryData);
        }

        res.status(200).json({

            status: 200,
            success: true,
            message: "Discount created successfully",
            result: discount
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create discount",
        })
    }
}


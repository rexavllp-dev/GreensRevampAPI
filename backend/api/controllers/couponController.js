import session from 'session';
import { createACoupon, deleteACoupon, getACoupon, getCoupons, updateACoupon } from "../models/couponModel.js";
import { calculatePrice } from "../helpers/calculatePrice.js";

export const createCoupon = async (req, res) => {
    const couponData = req.body;

    try {
        const newCoupon = await createACoupon(couponData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Successfully created coupon",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create coupon",
            error: error
        });
    }
};




export const updateCoupon = async (req, res) => {

    const couponData = req.body;
    const couponId = req.params.couponId;


    try {
        const coupon = await updateACoupon(couponId, couponData);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Successfully updated coupon",
            result: coupon
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update coupon",
            error: error
        });
    }
};



export const getSingleCoupon = async (req, res) => {
    const couponId = req.params.couponId;

    try {
        const coupon = await getACoupon(couponId);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Successfully fetched coupon",
            result: coupon
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch coupon",
            error: error
        });
    }
};



export const getAllCoupons = async (req, res) => {

    try {
        const coupons = await getCoupons();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Successfully fetched coupons",
            result: coupons
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch coupons",
            error: error
        });
    }
};



export const deleteCoupon = async (req, res) => {
    const couponId = req.params.couponId;

    try {
        const coupons = await deleteACoupon(couponId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Successfully fetched coupons",
            result: coupons
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch coupons",
            error: error
        });
    }
};

// Apply coupon
export const applyCoupon = async (req, res) => {

    const { couponCode } = req.body;

    try {

        const coupon = await getCouponByCode(couponCode);

        if (!coupon) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Coupon not found"
            })
        }

        if (coupon.coupon_status === false) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Coupon not active"
            })
        }

        // Check coupon start date and end date
        const couponStartDate = new Date(coupon.coupon_start_date);
        const couponEndDate = new Date(coupon.coupon_end_date);
        const currentDate = new Date();
        if (currentDate < couponStartDate || currentDate > couponEndDate) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Coupon expired"
            })
        }

        const coupons = session.coupons;

        // Check coupon limit reached
        if (coupons.length > 2) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Coupon limit reached"
            })
        }

        // Check coupon type limit reached (normal)
        if (coupons.length === 1 && coupons[0].coupon_type === 'normal' && coupon.coupon_type === 'normal') {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Normal coupon limit reached. You can only apply refund coupon"
            })
        }

        // Check coupon type limit reached (refund)
        if (coupons.length === 1 && coupons[0].coupon_type === 'refund' && coupon.coupon_type === 'refund') {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Refund coupon limit reached"
            })
        }

        coupons.push(coupon);
        session.coupons = coupons;

        // Sort the coupon type based on the coupon type to calculate the percentage discount first
        function sortByCouponType(a, b) {
            if (a.coupon_type === "percentage" && b.coupon_type !== "percentage") {
                return -1; // "percentage" comes before other types
            }
            if (a.coupon_type !== "percentage" && b.coupon_type === "percentage") {
                return 1; // "percentage" comes after other types
            }
            return 0; // Keep the order unchanged for other cases
        }

        coupons = coupons.sort(sortByCouponType);

        const { totals } = calculatePrice({
            session: session,
            calculateCouponDiscount: false
        })

        // Map through the coupons and calculate the discount
        let discount = 0;
        let is_free_shipping = false;

        for (const coupon of coupons) {

            const couponType = coupon.coupon_type;
            const couponDiscountType = coupon.coupon_discount_type;
            const couponValue = coupon.coupon_value;
            const isFreeShipping = coupon.is_free_shipping;
            const minAmount = coupon.coupon_min_amount;

            let withDiscount = parseFloat(totals?.couponCheckPrices?.withDiscount) - parseFloat(discount)
            let withoutDiscount = parseFloat(totals?.couponCheckPrices?.withoutDiscount) - parseFloat(discount)
            let couponPriceValue = 0;

            if (couponType === 'normal' && couponDiscountType === 'percentage') {
                couponPriceValue = withDiscount * (couponValue / 100);
                if (withDiscount < minAmount) {
                    if (coupons.length === 1) {
                        return res.status(400)
                            .json({
                                status: 400,
                                success: false,
                                message: "Coupon min amount is not reached"
                            })
                    }
                    else {
                        return res.status(400)
                            .json({
                                status: 400,
                                success: false,
                                message: "Coupon min amount is not reached. Applied max discount coupon"
                            })
                    }
                }
                discount += couponPriceValue;
                is_free_shipping = isFreeShipping;
            } else if (couponType === 'normal' && couponDiscountType === 'value') {
                couponPriceValue = couponValue;
                if (withDiscount < minAmount) {
                    if (coupons.length === 1) {
                        return res.status(400)
                            .json({
                                status: 400,
                                success: false,
                                message: "Coupon min amount is not reached"
                            })
                    }
                    else {
                        return res.status(400)
                            .json({
                                status: 400,
                                success: false,
                                message: "Coupon min amount is not reached. Applied max discount coupon"
                            })
                    }
                }
                discount += couponPriceValue;
                is_free_shipping = isFreeShipping;
            } else if (couponType === 'refund' && couponDiscountType === 'percentage') {
                couponPriceValue = withoutDiscount * (couponValue / 100);
                if (withoutDiscount < minAmount) {
                    if (coupons.length === 1) {
                        return res.status(400)
                            .json({
                                status: 400,
                                success: false,
                                message: "Coupon min amount is not reached"
                            })
                    }
                    else {
                        return res.status(400)
                            .json({
                                status: 400,
                                success: false,
                                message: "Coupon min amount is not reached. Applied max discount coupon"
                            })
                    }
                }
                discount += couponPriceValue;
                is_free_shipping = isFreeShipping;
            } else if (couponType === 'refund' && couponDiscountType === 'value') {
                couponPriceValue = couponValue;
                if (withoutDiscount < minAmount) {
                    if (coupons.length === 1) {
                        return res.status(400)
                            .json({
                                status: 400,
                                success: false,
                                message: "Coupon min amount is not reached"
                            })
                    }
                    else {
                        return res.status(400)
                            .json({
                                status: 400,
                                success: false,
                                message: "Coupon min amount is not reached. Applied max discount coupon"
                            })
                    }
                }
                discount += couponPriceValue;
                is_free_shipping = isFreeShipping;
            }


        }

        const discountData = {
            discount: discount,
            is_free_shipping: is_free_shipping
        }

        session.coupon_discount = discountData;
        await session.save();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Coupon applied successfully"
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to apply coupon",
            error: error
        });

    }

}
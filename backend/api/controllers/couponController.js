import { createACoupon, deleteACoupon, getACoupon, getCoupons, updateACoupon } from "../models/couponModel";




export const createCoupon = async (req, res) => {
    const couponData = req.body;

    try {
        const newCoupon = await createACoupon(couponData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Successfully created coupon",
            result: newCoupon
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
    const couponId = req.params.couponId;
    const couponData = req.body;

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


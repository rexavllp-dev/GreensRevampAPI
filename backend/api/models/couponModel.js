import db from "../../config/dbConfig.js";


export const createACoupon = async (couponData) => {
    const coupon = await db("coupons").insert(couponData);
    return coupon;
};


export const updateACoupon = async (couponId, couponData) => {
    const coupon = await db("coupons")
        .where({ id: couponId }) 
        .update(couponData)
        .returning('*');
    return coupon;
};


export const getACoupon = async (couponId) => {
    const coupon = await db("coupons")
        .where({ id: couponId })
        .first();
    return coupon;
};


export const getCoupons = async () => {
    const coupons = await db("coupons")
        .select("*");
    return coupons;
};


export const deleteACoupon = async (couponId) => {
    const coupon = await db("coupons")
        .where({ id: couponId })
        .del();
    return coupon;
};
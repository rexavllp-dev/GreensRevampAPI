import express from 'express';
import { applyCoupon, createCoupon, deleteCoupon, getAllCoupons, getSingleCoupon, updateCoupon } from '../controllers/couponController.js';


const router = express.Router();


// create coupon
router.post('/create_coupon', createCoupon);

// update coupon
router.put('/update_coupon/:couponId', updateCoupon);

// get a single coupon
router.get('/get_coupon/:couponId', getSingleCoupon);

// get all coupons
router.get('/get_all_coupons', getAllCoupons);

// delete coupon
router.delete('/delete_coupon/:couponId', deleteCoupon);

// Apply coupon
router.post('/apply-coupon', applyCoupon);





export default router;
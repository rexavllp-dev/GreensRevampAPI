import dotenv from 'dotenv';
import { calculatePrice } from '../helpers/calculatePrice.js';

dotenv.config();

const verifyProductPrice = async (req, res, next) => {

    if (!req.session.totals) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'Cart total not found',
        })
    }

    let isStorePickup = req.query.isStorePickup === 'true' ? true : false;
    let isCod = req.query.isCod === 'true' ? true : false;

    // const cart = req.session.cart;
    const totals = req.session.totals;

    const recalculatedTotal = await calculatePrice({
        session: req.session,
        isStorePickup: isStorePickup,
        couponCodes: [],
        rewardPoints: 0,
        isCod: isCod,
    })

    if(recalculatedTotal?.totals?.grandTotal !== totals.grandTotal){
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'Mismatch in product price',
        })
    }
    else{
        next();
    }

};

export default verifyProductPrice;
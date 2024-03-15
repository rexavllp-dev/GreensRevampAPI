import express from 'express';
import { adminUserRegister, approveCompanyByAdmin, isActiveByAdmin, isNotActiveByAdmin, rejectCompanyByAdmin } from '../controllers/adminController.js';
import { updateAndApproveOrRejectBulkOrders } from '../controllers/bulkController.js';
import { AddPrivacyPolicy, deletePrivacyPolicyById, getALLPrivacyPolicy, updatePrivacyPolicyById } from '../controllers/PrivacyPoliciesController.js';
import { getAllReturnsForAdmin, getSingleReturn, updateReturnStatus } from '../controllers/returnController.js';
import { getAllReplacementsForAdmin, getSingleReplacement, updateReplacementStatus } from '../controllers/replaceController.js';
import { createBanner, deleteBanner, getAllBanners, getSingleBanner, updateBanner } from '../controllers/homePageBannerController.js';
import { createSeason, deleteSeason, getAllSeasons, getSingleSeason, updateSeason } from '../controllers/seasonController.js';
import { createFeed, deleteFeed, getAllFeeds, getSingleFeed, updateFeed } from '../controllers/feedController.js';
import { createAds, deleteAds, getAllAds, getSingleAds, updateAds } from '../controllers/adsController.js';
import { getAllActivityOfUser } from '../controllers/generateActivityLogController.js';
import { createMaintenance, getAllMaintenance, getMaintenance, updateMaintenance } from '../controllers/adminMaintenanceController.js';
import { createStore, getAllStore, getStore, updateStore } from '../controllers/adminStoreController.js';
import { createMail, getAllMails, getMail, updateMail } from '../controllers/adminMailController.js';
import { createNewsletter, getAllNewsletters, getNewsletter, updateNewsletter } from '../controllers/adminNewsletterController.js';
import { createFreeShipping, getAllFreeShipping, getFreeShipping, updateFreeShipping } from '../controllers/adminFreeShippingController.js';
import { createStorePickup, getAllStorePickup, getStorePickup, updateStorePickup } from '../controllers/adminStorePickupController.js';
import { createStorePickupCharge, getAllStorePickupCharge, getStorePickupCharge, updateStorePickupCharge } from '../controllers/adminStorePickUpChargeController.js';
import { createOnsiteDelivery, getOnsiteDelivery, updateOnsiteDelivery } from '../controllers/adminOnsiteDeliveryController.js';
import { getAllOnsiteDelivery } from '../models/adminOnsiteDelivery.js';


const router = express.Router();

// admin can create user
router.post("/create-user", adminUserRegister);
// not suspend user
router.put('/activate/:userId', isActiveByAdmin);
// suspend user
router.put('/deactivate/:userId', isNotActiveByAdmin);
//  verify company
router.put('/approve/:companyId', approveCompanyByAdmin);
//  reject company verification  company
router.put('/reject/:companyId', rejectCompanyByAdmin);

// admin can approve bulk above max orders
// approve Bulk Max Order and reject 
router.put('/update-bulk-request/:bulkId', updateAndApproveOrRejectBulkOrders);


// privacy policy routes

// create privacy policy
router.post('/create-privacy-policy', AddPrivacyPolicy);

// get privacy policy
router.get('/get-privacy-policy', getALLPrivacyPolicy);

// update privacy policy
router.put('/update-privacy-policy/:id', updatePrivacyPolicyById);

// delete privacy policy
router.delete('/delete-privacy-policy/:id', deletePrivacyPolicyById);

// admin return

// update return status
router.put('/return/update-status/:returnId', updateReturnStatus);

// get all returns for admin
router.get('/return/get-all-returns', getAllReturnsForAdmin);

// get single return
router.get('/return/get-return/:returnId', getSingleReturn);



// update replacement status
router.put('/replacement/update-status/:replacementId', updateReplacementStatus);

// get single replacement for admin
router.get('/replacement/get-replacement/:replacementId', getSingleReplacement);

// get all replacements for admin
router.get('/replacement/get-all-replacements', getAllReplacementsForAdmin);



// Home page banner routes
// create banner
router.post('/banner/create_banner', createBanner);

// update banner
router.put('/banner/update_banner/:bannerId', updateBanner);

// get a single banner
router.get('/banner/get_banner/:bannerId', getSingleBanner);

// get all banners
router.get('/banner/get_all_banners', getAllBanners);

//delete banner
router.delete('/banner/delete_banner/:bannerId', deleteBanner);


// Home page  seasons
// create a season
router.post('/seasons/create_season', createSeason);

// update season
router.put('/seasons/update_season/:seasonId', updateSeason);

// get a single season
router.get('/seasons/get_season/:seasonId', getSingleSeason);

// get all seasons
router.get('/seasons/get_all_seasons', getAllSeasons);

//delete seasons
router.delete('/seasons/delete_season/:seasonId', deleteSeason);



// Home page  feeds
// create a feed
router.post('/feeds/create_feed', createFeed);

// update feed
router.put('/feeds/update_feed/:feedId', updateFeed);

// get a single feed
router.get('/feeds/get_feed/:feedId', getSingleFeed);

// get all feed
router.get('/feeds/get_all_feeds', getAllFeeds);

//delete feed
router.delete('/feeds/delete_feed/:feedId', deleteFeed);




// Home page  ads
// create a feed
router.post('/ads/create_ads', createAds);

// update feed
router.put('/ads/update_ads/:adsId', updateAds);

// get a single feed
router.get('/ads/get_ads/:adsId', getSingleAds);

// get all feed
router.get('/ads/get_all_ads', getAllAds);

//delete feed
router.delete('/ads/delete_ads/:adsId', deleteAds);



// get all activity of user
router.get('/generate_activity', getAllActivityOfUser);



// admin settings API 

// admin maintenance API

// create maintenance
router.post('/maintenance/create_maintenance', createMaintenance);

// update maintenance
router.put('/maintenance/update_maintenance/:maintenanceId', updateMaintenance);

// get maintenance
router.get('/maintenance/get_maintenance/:maintenanceId', getMaintenance);

// get all maintenance
router.get('/maintenance/get_all_maintenance', getAllMaintenance);

// __________________________________________________________________________________________________________________

// admin store API

// create store
router.post('/store/create_store', createStore);

// update maintenance
router.put('/store/update_store/:storeId', updateStore);

// get maintenance
router.get('/store/get_store/:storeId', getStore);

// get all maintenance
router.get('/store/get_all_store', getAllStore);


// admin mail API

// create mail
router.post('/mail/create_mail', createMail);

// update mail
router.put('/mail/update_mail/:mailId', updateMail);

// get mail
router.get('/mail/get_mail/:mailId', getMail);

// get all mail
router.get('/mail/get_all_mail', getAllMails);


// admin newsletter API

// create newsletter
router.post('/newsletter/create_newsletter', createNewsletter);

// update newsletter
router.put('/newsletter/update_newsletter/:newsletterId', updateNewsletter);

// get newsletter
router.get('/newsletter/get_newsletter/:newsletterId', getNewsletter);

// get all newsletter
router.get('/newsletter/get_all_newsletter', getAllNewsletters);


// admin shipping method  API

// create shipping method
router.post('/shipping_method/create_free_shipping', createFreeShipping);

// update shipping method
router.put('/shipping_method/update_free_shipping/:shippingId', updateFreeShipping);

// get shipping method
router.get('/shipping_method/get_free_shipping/:shippingId', getFreeShipping);

// get all shipping method
router.get('/shipping_method/get_all_free_shipping', getAllFreeShipping);



// store pick up API ROUTES

// create store pick up
router.post('/shipping_method/create_store_pickup', createStorePickup);

// update store pick up
router.put('/shipping_method/update_store_pickup/:shippingId', updateStorePickup);

// get store pick up
router.get('/shipping_method/get_store_pickup/:shippingId', getStorePickup);

// get all store pick up
router.get('/shipping_method/get_all_store_pickup', getAllStorePickup);



// store pick up charges  API ROUTES

// create store pick up
router.post('/shipping_method/create_store_pickup_charges', createStorePickupCharge);

// update store pick up
router.put('/shipping_method/update_store_pickup_charges/:shippingId', updateStorePickupCharge);

// get store pick up
router.get('/shipping_method/get_store_pickup_charges/:shippingId', getStorePickupCharge);

// get all store pick up
router.get('/shipping_method/get_all_store_pickup_charges', getAllStorePickupCharge);


// admin onsite delivery API

// create onsite delivery
router.post('/shipping_method/create_onsite_delivery', createOnsiteDelivery);

// update onsite delivery
router.put('/shipping_method/update_onsite_delivery/:shippingId', updateOnsiteDelivery);

// get onsite delivery
router.get('/shipping_method/get_onsite_delivery/:shippingId', getOnsiteDelivery);

// get all onsite delivery
router.get('/shipping_method/get_all_onsite_delivery', getAllOnsiteDelivery);


export default router;



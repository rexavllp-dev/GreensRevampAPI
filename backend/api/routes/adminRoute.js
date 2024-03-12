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

export default router;



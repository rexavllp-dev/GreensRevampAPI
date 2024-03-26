import express from 'express';
import { adminUserRegister, approveCompanyByAdmin, isActiveByAdmin, isNotActiveByAdmin, rejectCompanyByAdmin } from '../controllers/adminController.js';
import { updateAndApproveOrRejectBulkOrders } from '../controllers/bulkController.js';
import { AddPrivacyPolicy, deletePrivacyPolicyById, getALLPrivacyPolicy, updatePrivacyPolicyById } from '../controllers/PrivacyPoliciesController.js';
import { getAllReturnsForAdmin, getSingleReturn, updateReturnStatus } from '../controllers/returnController.js';
import { getAllReplacementsForAdmin, getSingleReplacement, updateReplacementStatus } from '../controllers/replaceController.js';
import { createBanner, deleteBanner, getAllBanners, getSingleBanner, updateBanner } from '../controllers/homePageBannerController.js';
import { createSeason, deleteSeason, getAllSeasons, getSingleSeason, updateSeason } from '../controllers/seasonController.js';
import { createFeed, deleteFeed, getAllFeeds, getSingleFeed, updateFeed } from '../controllers/feedController.js';
import { createAds,  deleteAds,  getAllAds, getSingleAds, updateAds } from '../controllers/adsController.js';
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
import { getAllCompanyPendingApprovals, getAllExpiredProducts, getAllExpiredTradeLicense, getAllLatestCancelledOrders, getAllLatestReplacement, getAllLatestReturn, getAllOutOfStock, getAllProductsMinQty, getAllRecentOrders, getAllTotalCounts, getAllTotalOrders, getAllTotalSalesAmount } from '../controllers/adminDashBoardController.js';
import { createPage, deletePage, getAllPages, getPage, updatePage } from '../controllers/pageController.js';
import { createPageSeo, deletePageSeo, getAllPageSeos, getPageSeo, updatePageSeo } from '../controllers/pageSeoController.js';
import { addDiscount } from '../controllers/adminDiscountController.js';
import { createMenu, deleteMenu, getAllMenus, getMenu, updateMenu } from '../controllers/menuController.js';
import { createRole, getAllRoles, updateRole } from '../controllers/userRolesController.js';
import { createRecipe, deleteRecipeProduct, getAllRecipeProductsByRecipeId } from '../controllers/recipeController.js';
import { createHomePageCategory, deleteHomePageCategory, getAllHomePageCategories, getHomePageCategory } from '../controllers/homePageCategoryController.js';
import { createHomePageBrand, deleteHomePageBrand, getAllHomePageBrands, getHomePageBrand } from '../controllers/homePageBrandController.js';
import { getAllCustomerOrderReports } from '../controllers/reportsController.js';



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
router.delete('/seasons/delete_season', deleteSeason);



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
router.delete('/feeds/delete_feed', deleteFeed);




// Home page  ads
// create a feed
router.post('/ads/create_ads', createAds);

// update ads
router.put('/ads/update_ads/:adsId', updateAds);

// get a single feed
router.get('/ads/get_ads/:adsId', getSingleAds);

// get all feed
router.get('/ads/get_all_ads', getAllAds);

//delete feed
router.delete('/ads/delete_ads', deleteAds);


// homepage category routes


// create homepage category
router.post('/homepage_category/create_homepage_category', createHomePageCategory);

// get a homepage category
router.get('/homepage_category/get_homepage_category/:homepageCategoryId', getHomePageCategory);

// get all homepage category
router.get('/homepage_category/get_all_homepage_categories', getAllHomePageCategories);

// delete homepage category
router.delete('/homepage_category/delete_homepage_category', deleteHomePageCategory);


// homepage brand routes

// create homepage brand
router.post('/homepage_brand/create_homepage_brand', createHomePageBrand);
// get a homepage brand
router.get('/homepage_brand/get_homepage_brand/:homepageBrandId', getHomePageBrand);

// get all homepage brand
router.get('/homepage_brand/get_all_homepage_brands', getAllHomePageBrands);

// delete homepage brand
router.delete('/homepage_Brand/delete_homepage_Brand', deleteHomePageBrand);



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



// admin dashboard API ROUTES

// get all total orders
router.get('/dashboard/get_all_total_orders', getAllTotalOrders);

// get all recent orders
router.get('/dashboard/get_all_recent_orders', getAllRecentOrders);

// get all latest cancelled orders
router.get('/dashboard/get_all_latest_cancelled_orders', getAllLatestCancelledOrders);

// get all latest return
router.get('/dashboard/get_all_latest_return', getAllLatestReturn);

// get all latest replacement
router.get('/dashboard/get_all_latest_replacement', getAllLatestReplacement);

// get all out of stock
router.get('/dashboard/get_all_out_of_stock', getAllOutOfStock);

// get all expired products
router.get('/dashboard/get_all_expired_products', getAllExpiredProducts);

// get all products min qty
router.get('/dashboard/get_all_products_min_qty', getAllProductsMinQty);

// get all company expired trade licenses
router.get('/dashboard/get_all_expired_trade_licenses', getAllExpiredTradeLicense);

// get all total sales
router.get('/dashboard/get_all_total_sales', getAllTotalSalesAmount);

// get all company pending approval
router.get('/dashboard/get_all_company_pending_approval', getAllCompanyPendingApprovals);

// get all total counts
router.get('/dashboard/get_all_total_counts', getAllTotalCounts);



// admin pages API ROUTES

// create page
router.post('/pages/create_page', createPage);

// update page
router.put('/pages/update_page/:pageId', updatePage);

// get page
router.get('/pages/get_page/:pageId', getPage);

// get all pages
router.get('/pages/get_all_pages', getAllPages);

// delete page
router.delete('/pages/delete_page/:pageId', deletePage);


// Pages SEO
// create page seo
router.post('/pages/create_page_seo', createPageSeo);

// update page seo
router.put('/pages/update_page_seo/:pageSeoId', updatePageSeo);

// get page seo
router.get('/pages/get_page_seo/:pageSeoId', getPageSeo);

// get all page seo
router.get('/pages/get_all_page_seo', getAllPageSeos);

// delete page seo
router.delete('/pages/delete_page_seo/:pageSeoId', deletePageSeo);


// admin menus API ROUTES

// create menu
router.post('/menus/create_menu', createMenu);

// update menu
router.put('/menus/update_menu/:menuId', updateMenu);

// get menu
router.get('/menus/get_menu/:menuId', getMenu);

// get all menu
router.get('/menus/get_all_menu', getAllMenus);

// delete menu
router.delete('/menus/delete_menu/:menuId', deleteMenu);



// create brand discount 
router.post('/discount/create_discount', addDiscount); 



// admin roles API ROUTES

// create role
router.post('/roles/create_role', createRole);

// update role
router.put('/roles/update_role/:roleId', updateRole);

// get all roles
router.get('/roles/get_all_roles', getAllRoles);


// Admin Recipes API ROUTES

// create recipe
router.post('/recipes/create_recipe', createRecipe);



// Admin Recipe Products API ROUTES

//get all recipe products by recipe id
router.get('/recipes/get_all_recipe_products/:recipeId', getAllRecipeProductsByRecipeId); 

// delete recipe product
router.delete('/recipes/delete_recipe_product/:recipeProductId', deleteRecipeProduct);


// reports API ROUTES

// get all customer order reports 
router.get('/reports/get_all_customer_order_reports', getAllCustomerOrderReports);



export default router;



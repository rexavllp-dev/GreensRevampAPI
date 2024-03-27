import { createAProduct, createProductGallery, deleteAProduct, deleteProductImageById, fetchAllOptionProducts, getAllProducts, getProductById, getProductsByCategory, getsAllTopTrendingProducts, getSortedProducts, getsProductsByBrand, saveImageUrl, updateAProduct } from "../models/productModel.js";
import aws from 'aws-sdk';
import { getPrdPrice } from "../models/productPriceModel.js";
import { saveSearchHistory } from "../models/searchHistoryModel.js";
import { addProductCategories, updateProductCategories } from "../models/categoryModel.js";



const awsConfig = ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.S3_BUCKET_NAME
});

const s3 = new aws.S3(awsConfig);



// create products
export const createProduct = async (req, res) => {

    const {

        prd_name,
        prd_description,
        prd_storage_type,
        prd_tax_class,
        prd_tags,
        prd_expiry_date,
        prd_dashboard_status,
        prd_status,
        prd_sales_unit,
        prd_return_type,
        prd_brand_id,
        use_and_care,
        shipping_and_returns,
        dimensions_and_more_info,
        ein_code,
        show_expiry_on_dashboard,
        categories,


    } = req.body;

    try {

        const userId = req.user?.userId;


        // create a product
        const newProduct = await createAProduct({

            user_id: userId,
            prd_name,
            prd_description,
            prd_storage_type,
            prd_tax_class,
            prd_tags,
            prd_expiry_date,
            prd_dashboard_status,
            prd_status,
            prd_sales_unit,
            prd_return_type,
            prd_brand_id,
            use_and_care,
            shipping_and_returns,
            dimensions_and_more_info,
            ein_code,
            show_expiry_on_dashboard,


        })

        const productId = newProduct[0]?.id;

        // Add categories to the product
        await addProductCategories(productId, categories);

        res.status(201).json({
            status: 201,
            success: true,
            message: "product created successfully",
            data: newProduct
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to Create Product! Please try again later."
        });
    }

};


// update product 

export const updateProduct = async (req, res) => {
    try {
        const {

            prd_name,
            prd_description,
            prd_storage_type,
            prd_tax_class,
            prd_tags,
            prd_expiry_date,
            prd_dashboard_status,
            prd_status,
            prd_sales_unit,
            prd_return_type,
            prd_brand_id,
            use_and_care,
            shipping_and_returns,
            dimensions_and_more_info,
            ein_code,
            show_expiry_on_dashboard,
            search_keywords,
            categories,



        } = req.body;

        const userId = req.user?.userId;

        const productId = req.params.productId; // Assuming you have a route parameter for the product ID

        // Call the model function to update the product
        const updatedProduct = await updateAProduct(productId, {

            user_id: userId,
            prd_name,
            prd_description,
            prd_storage_type,
            prd_tax_class,
            prd_tags,
            prd_expiry_date,
            prd_dashboard_status,
            prd_status,
            prd_sales_unit,
            prd_return_type,
            prd_brand_id,
            use_and_care,
            shipping_and_returns,
            dimensions_and_more_info,
            ein_code,
            show_expiry_on_dashboard,
            search_keywords,


        });

        // Update product categories
        await updateProductCategories(productId, categories);


        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to update product. Please try again later.',
        });
    }
};


// get all products

export const getAllProduct = async (req, res) => {
    try {

        let page = null;
        let per_page = null;
        let search_query = null;
        let sort = null;
        let minPrice = req.query.min_price;
        let maxPrice = req.query.max_price;

        let userId = req.user?.userId;

        // let sortFeatured = false;

        if (req.query.search_query !== null && req.query.search_query !== undefined && req.query.search_query !== 'undefined') {
            search_query = req.query.search_query;
        }

        if (req.query.page !== null && req.query.page !== undefined && req.query.page !== 'undefined') {
            page = parseInt(req.query.page);
        }

        if (req.query.per_page !== null && req.query.per_page !== undefined && req.query.per_page !== 'undefined') {
            per_page = parseInt(req.query.per_page);
        }

        if (req.query.sort !== null && req.query.sort !== undefined && req.query.sort !== 'undefined') {
            sort = req.query.sort;
        }


        // if (req.query.sort_featured !== null && req.query.sort_featured !== undefined && req.query.sort_featured !== 'undefined') {
        //     sortFeatured = req.query.sort_featured === 'true';
        // }

        // console.log("search", search_query);

        const filtersParam = req.query.filters;

        let filters = [];

        // Attempt to parse the filters parameter
        if (filtersParam) {
            filters = JSON.parse(filtersParam);
        };

        const products = await getAllProducts(page, per_page, search_query, filters, sort, minPrice, maxPrice, userId);

        // Save search history
        if (search_query) {
            await saveSearchHistory(userId, search_query, products.searchResultCount);
        };

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Products fetched successfully',
            data: products,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to fetch Product! Please try again later."
        });
    }
};


export const getAllOptionProducts = async (req, res) => {
    try {

        let page = null;
        let per_page = null;
        let search_query = null;
        let sort = null;
        // let sortFeatured = false;

        if (req.query.search_query !== null && req.query.search_query !== undefined && req.query.search_query !== 'undefined') {
            search_query = req.query.search_query;
        }

        if (req.query.page !== null && req.query.page !== undefined && req.query.page !== 'undefined') {
            page = req.query.page;
        }

        if (req.query.per_page !== null && req.query.per_page !== undefined && req.query.per_page !== 'undefined') {
            per_page = req.query.per_page;
        }

        if (req.query.sort !== null && req.query.sort !== undefined && req.query.sort !== 'undefined') {
            sort = req.query.sort;
        }

        // if (req.query.sort_featured !== null && req.query.sort_featured !== undefined && req.query.sort_featured !== 'undefined') {
        //     sortFeatured = req.query.sort_featured === 'true';
        // }



        console.log("search", search_query);

        const filtersParam = req.query.filters;

        let filters = [];

        // Attempt to parse the filters parameter
        if (filtersParam) {
            filters = JSON.parse(filtersParam);
        };

        const products = await fetchAllOptionProducts(page, per_page, search_query, filters, sort);

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Products fetched successfully',
            data: products,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to fetch Product! Please try again later."
        });
    }
};




// get a product

export const getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.productId;


        const product = await getProductById(productId);
        if (!product) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Product not found',
            });
        };

        // Retrieve the product price information using getPrdPrice
        const priceInfo = await getPrdPrice(product?.products_price_id); // Assuming 'price_id' is the relevant field in the product

        if (!priceInfo) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Failed to fetch product price. Please try again later.',
            });
        }

        product.productPrice = priceInfo;

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product single fetched successfully',
            data: {
                product: product,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to fetch product. Please try again later.',
        });
    }
};


// delete a product

export const deleteProduct = async (req, res) => {
    const productIds = req.query.data;
    try {

        let products = JSON.parse(productIds);

        for (let i = 0; i < products.length; i++) {
            await deleteAProduct(products[i]);
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product deleted successfully',

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete product. Please try again later.',
        });
    }
};


// add product images
export const addProductImages = async (req, res) => {

    try {
        const productId = req.params.productId;
        let files = req.files?.files;

        if (!files?.length) {
            files = [files]
        }

        const isBaseImage = req.body?.isBaseImage;
        let productImages = [];

        for (let i = 0; i < files?.length; i++) {
            const file = files[i];


            const resizedBuffer = await sharp(file.data)
                .resize({ width: 300, height: 300 })
                .toBuffer();

            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/${file.name}`,
                Body: resizedBuffer,
                ContentType: file.mimetype,
            };

            const s3Data = await s3.upload(uploadParams).promise();

            const imageDetails = {
                product_id: productId,
                url: s3Data.Location,
                is_baseimage: isBaseImage,
            };

            productImages.push(imageDetails);
        }
        console.log(productImages);

        // Save product images to the database
        const savedImages = await createProductGallery(productImages);

        if (savedImages && savedImages.length > 0) {
            const baseImage = savedImages.find(item => item.is_baseimage === true);
            if (baseImage && baseImage.url) {
                // Update the image_url column using the imageUpdater module
                await saveImageUrl(productId, baseImage.url);
            }
        }

        res.status(201).json({
            status: 201,
            success: true,
            message: "Product images added successfully.",
            result: productImages,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to add product images! Please try again later.",
        });
    }
};



// delete product image
export const deleteProductImage = async (req, res) => {
    const imageId = req.params.imageId;
    try {
        const deletedImage = await deleteProductImageById(imageId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Product image deleted successfully",
            result: deletedImage
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete product image",
            error: error
        });
    }
};




// product sorting
export const getProductsWithSorting = async (req, res) => {
    const { sortBy } = req.body;
    try {
        const products = await getSortedProducts(sortBy);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Product sorted successfully",
            result: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to sort products"
        });
    }
};



export const getProductsOfCategory = async (req, res) => {

    const categoryId = req.params.categoryId;
    try {

        let page = null;
        let per_page = null;
        let search_query = null;
        if (req.query.search_query !== null && req.query.search_query !== undefined && req.query.search_query !== 'undefined') {
            search_query = req.query.search_query;
        }
        if (req.query.page !== null && req.query.page !== undefined && req.query.page !== 'undefined') {
            page = req.query.page;
        }
        if (req.query.per_page !== null && req.query.per_page !== undefined && req.query.per_page !== 'undefined') {
            per_page = req.query.per_page;
        }
        console.log(search_query);

        const filtersParam = req.query.filters;

        let filters = [];

        // Attempt to parse the filters parameter
        if (filtersParam) {
            filters = JSON.parse(filtersParam);
        };

        const products = await getProductsByCategory(page, per_page, search_query, filters, categoryId);
        console.log("products", products);

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Products fetched successfully',
            data: products,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: "Failed to fetch Product! Please try again later."
        });
    }
};



export const getAllTopTrendingProducts = async (req, res) => {


    try {

        const topTrendingProducts = await getsAllTopTrendingProducts();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Top trending products fetched successfully",
            result: topTrendingProducts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch top trending products",
            error: error
        });
    }
};



export const getProductsByBrands = async (req, res) => {

    try {

        const productId = req.params.productId;

        const product = await getProductById(productId);
        console.log(product);

        const productWithBrand = await getsProductsByBrand(product.prd_brand_id);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Product Brands fetched successfully",
            result: productWithBrand
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch product brands",
            error: error
        });
    }
};





import { getPublicProductById, getPublicProducts } from "../models/publicProductModel.js";


export const getAllProductPublic = async (req, res) => {
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
        // Add filter to check if the discount price is null or not
        filters.push({ column: 'is_discount', operator: '=', value: true }); 
    }
        const products = await getPublicProducts(page, per_page, search_query, filters, sort);

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


// public get single controller 

export const getSingleProductPublic = async (req, res) => {
    try {
        const productId = req.params.productId;


        const products = await getPublicProductById(productId);
        console.log(products);
        if (!products || products.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Product not found',
            });
        };


        // const productUrls = products.map(product => ({
        //     id: product.id,
        //     product_id: product.id,
        //     url: product.url,
        //     is_baseimage: product.is_baseimage,
        // }));


        res.status(200).json({
            status: 200,
            success: true,
            message: 'Product single fetched successfully',
            data: {
                product: products,
                // productUrls: productUrls
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



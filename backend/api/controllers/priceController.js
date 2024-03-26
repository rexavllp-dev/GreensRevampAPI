import { getPriceByProductIdAndCalculate } from "../models/bulkModel.js";
import { createPrdPrice, deletePrdPrice, getAllPrdPrice, getBulkDiscountPriceByProductId, getPrdPrice, getProductPriceById, updatePrdPrice, updatePriceHistory } from "../models/productPriceModel.js";


// create price
export const createPrice = async (req, res) => {

  try {
    const { prd_status, prd_dashboard_status, ...priceData } = req.body;

    console.log(req.body)


    const product = await getProductPriceById(priceData?.product_id);



    if (!product) {

      const newPrice = await createPrdPrice(priceData, prd_status, prd_dashboard_status);

      await updatePriceHistory({
        product_price_id: newPrice[0].id,
        product_price: newPrice[0].product_price,
        special_price: newPrice[0].special_price,
        special_price_type: newPrice[0].special_price_type,
        special_price_start: newPrice[0].special_price_start,
        special_price_end: newPrice[0].special_price_end,
        user_id: req?.user?.id
      });

      res.status(201).json({
        status: 201,
        success: true,
        message: "Price added successfully",
        result: newPrice,
      });
    } else {

      // check if i gave special price is greater than bulk discount

      const bulkDiscountPrice = await getBulkDiscountPriceByProductId(priceData?.product_id);
      console.log(bulkDiscountPrice)

      const greatestBulkDiscount = Math.max(...bulkDiscountPrice);

      // calculate bulk discount price and product price minus it

      const calculateMaxDiscountPrice = parseFloat(priceData?.product_price) - parseFloat(greatestBulkDiscount)
      console.log('parseFloat(bulkDiscountPrice?.discounted_price): ', parseFloat(bulkDiscountPrice?.discounted_price));
      console.log('parseFloat(priceData?.product_price): ', parseFloat(priceData?.product_price));

      console.log(calculateMaxDiscountPrice)


      if (bulkDiscountPrice) {

        if (priceData?.is_discount === true && priceData?.special_price >= calculateMaxDiscountPrice) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: "discount price must be less than bulk discount price",
          });
        }
      }



      // Apply the special price
      await updatePrdPrice(priceData?.product_id, priceData, prd_status, prd_dashboard_status);

      //update the price history

      await updatePriceHistory({
        product_price_id: product.id,
        product_price: product.product_price,
        special_price: product.special_price,
        special_price_type: product.special_price_type,
        special_price_start: product.special_price_start,
        special_price_end: product.special_price_end,
        user_id: req?.user?.id
      });

      res.status(201).json({
        status: 201,
        success: true,
        message: "update successfully",
        result: {
          product_price_id: product.id,
          product_price: product.product_price,
          special_price: product.special_price,
          special_price_type: product.special_price_type,
          special_price_start: product.special_price_start,
          special_price_end: product.special_price_end,
          user_id: req?.user?.id,
          prd_status,
          prd_dashboard_status
        },
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed something went wrong",
    });
  }
};




// update price 

export const updatePrice = async (req, res) => {
  const { productId } = req.params;
  const { prd_status, prd_dashboard_status, ...priceData } = req.body;
  console.log(prd_status);
  try {


    // check if i gave special price is greater than bulk discount

    const bulkDiscountPrice = await getBulkDiscountPriceByProductId(productId);
    const productPrice = await getProductPriceById(productId);


    const greatestBulkDiscount = Math.max(...bulkDiscountPrice);

    console.log(greatestBulkDiscount)

    // calculate bulk discount price and product price minus it

    const calculateMaxDiscountPrice = parseInt(productPrice?.product_price) - parseInt(greatestBulkDiscount)

    console.log("this is product price", productPrice?.product_price)



    console.log(calculateMaxDiscountPrice)


    // bulk discount price must be less than product price

    if (bulkDiscountPrice) {
      console.log("this is bulk discount price", bulkDiscountPrice)
      console.log("this is product price", productPrice?.product_price)
      console.log("this is special price", priceData?.special_price)
      console.log("this is greatestBulkDiscount", greatestBulkDiscount)

      console.log(priceData?.special_price < greatestBulkDiscount)

      if (!(priceData?.special_price < calculateMaxDiscountPrice)) {
        console.log(priceData?.special_price < greatestBulkDiscount) // Log special price and discounted price
        return res.status(400).json({
          status: 400,
          success: false,
          message: "discount price must be less than bulk discount price",
        });
      }
    }

    const product = await getProductPriceById(productId);
    const productComputedPrice = await getPriceByProductIdAndCalculate(productId);
    console.log("product computed  data", productComputedPrice);

    // Retrieve discounted prices array
    const bulkDiscountedPrices = await getBulkDiscountPriceByProductId(productId);
    console.log("bulk data", bulkDiscountedPrices);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product not found',
      });
    };


    // Format the computed price to two decimal places
    // const computedPrice = parseFloat(productComputedPrice.computed_price).toFixed(2);


    // // Find the maximum discounted price
    // const maxDiscountedPrice = Math.max(...bulkDiscountedPrices);
    // console.log("max discounted price", maxDiscountedPrice);

    // // Check if discounted price is greater than product price
    // if (computedPrice <= maxDiscountedPrice) {
    //   console.log("checking_prices", computedPrice, maxDiscountedPrice);

    //   return res.status(400).json({
    //     status: 400,
    //     success: false,
    //     message: "Discounted price cannot be less than or equal to the product price.",
    //   });
    // };

    // Apply the special price
    await updatePrdPrice(productId, priceData, prd_status, prd_dashboard_status);

    //update the price history

    await updatePriceHistory({
      product_price_id: product.id,
      product_price: product.product_price,
      special_price: product.special_price,
      special_price_type: product.special_price_type,
      special_price_start: product.special_price_start,
      special_price_end: product.special_price_end,
      user_id: req?.user?.id
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "update successfully",
      result: {
        product_price_id: product.id,
        product_price: product.product_price,
        special_price: product.special_price,
        special_price_type: product.special_price_type,
        special_price_start: product.special_price_start,
        special_price_end: product.special_price_end,
        user_id: req?.user?.id,
        prd_status,
        prd_dashboard_status
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to update, something went wrong",
      error
    });
  }
};


// get price
export const getPrice = async (req, res) => {
  const priceId = req.params.priceId;
  console.log(priceId)
  try {
    const price = await getPrdPrice(priceId, res);
    console.log("price", price)
    if (!price) {
      res.status(404).json({ error: 'Price not found' });
      return;
    };

    res.status(201).json({
      status: 201,
      success: true,
      message: "Get the price successfully",
      result: price
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed something went wrong",
    });
  }
};


// get all price

export const getAllPrice = async (req, res) => {

  try {
    const price = await getAllPrdPrice();
    res.status(201).json({
      status: 201,
      success: true,
      message: "Get all price successfully",
      result: price
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed something went wrong",
    });
  }
}


// delete price

export const deletePrice = async (req, res) => {
  const { priceId } = req.params;
  try {
    const deletedPrice = await deletePrdPrice(priceId);
    res.status(201).json({
      status: 201,
      success: true,
      message: "Price deleted successfully",
      result: deletedPrice
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed something went wrong",
    });
  }
}
import { createPrdPrice, deletePrdPrice, getAllPrdPrice, getPrdPrice, getProductPriceById, updatePrdPrice, updatePriceHistory } from "../models/productPriceModel.js";


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

    const product = await getProductPriceById(productId);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product not found',
      });
    };



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
    const price = await getPrdPrice(priceId);
    console.log(price)
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








import { createPrdPrice, deletePrdPrice, getAllPrdPrice, getPrdPrice, getProductPriceById, updatePrdPrice, updatePriceHistory } from "../models/productPriceModel.js";


// create price
export const createPrice = async (req, res) => {
  const priceData = req.body;
  try {
    const newPrice = await createPrdPrice(priceData);
    

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
  const priceData = req.body;

  try {

    const product = await getProductPriceById(productId);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product not found',
      });
    };
    
    const calculateSpecialPrice = () => {
      console.log("product", product);
      const specialPriceType = product.special_price_type;
      console.log(specialPriceType)
      const specialPriceValue = product.special_price;
      console.log(specialPriceType, specialPriceValue);

      if (specialPriceType === 'percentage') {
        const percentageDiscount = (specialPriceValue / 100) * product.product_price;
        return product.product_price - percentageDiscount;
      } else if (specialPriceType === 'fixed') {
        return product.product_price - specialPriceValue; 
      } else {
        // No special price or invalid type, return the current price
        return product.product_price;
      }
    }

    const currentPrice = product.product_price;
    const specialPrice = calculateSpecialPrice();

    const specialPriceType = product.special_price_type
    console.log(specialPriceType);
    const specialPriceStart = product.special_price_start;
    const specialPriceEnd = product.special_price_end;
    const currentDate = new Date();

    if (specialPrice && specialPriceStart <= currentDate && currentDate <= specialPriceEnd) {
      // Apply the special price
      await updatePrdPrice(productId , priceData,{ product_price: specialPrice });
    } else {
      // Revert to the regular price
      await updatePrdPrice(productId,priceData,{ product_price: currentPrice });
    }

    const specialPriceValue = product.special_price;

     // Apply the special price
    await updatePrdPrice(productId,priceData, { product_price: specialPrice });

    //update the price history

    await updatePriceHistory(priceData,{
      product_price_id: product.id,
      product_price: currentPrice,
      special_price: specialPriceValue,
      special_price_type: specialPriceType,
      special_price_start: specialPriceStart,
      special_price_end: specialPriceEnd,
      user_id: req?.user?.id
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "update successfully",
      result: { product_price: specialPrice, special_price_type: specialPriceType }
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
  const { priceId } = req.params;
  try {
    const price = await getPrdPrice(priceId);
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








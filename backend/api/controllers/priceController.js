import { createPrdPrice, deletePrdPrice, getAllPrdPrice, getPrdPrice, updatePrdPrice,getPriceById, updatePriceHistory } from "../models/productPriceModel.js";


// create price
export const createPrice = async (req, res) => {
  const priceData = req.body;
  try {
    const newPrice = await createPrdPrice(priceData);
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
  const { priceId } = req.params;
  try {

    const price = await getPriceById(priceId);

    if (!price) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Price not found',
      });
    };

    const calculateSpecialPrice = (price) => {
      const specialPriceType = price.special_price_type;
      const specialPriceValue = price.special_price;
    
      if (specialPriceType === 'percentage') {
        const percentageDiscount = (specialPriceValue / 100) * price.product_price;
        return price.product_price - percentageDiscount;
      }  if (specialPriceType === 'fixed') {
        return price.product_price - specialPriceValue;
      } else {
        // No special price or invalid type, return the current price
        return price.product_price;
      }
    }

      


    const currentPrice = price.product_price;
    const specialPrice = calculateSpecialPrice(price);

      // Apply the special price
      await updatePrdPrice(priceId,{ product_price: specialPrice });

    const specialPriceStart = price.special_price_start;
    const specialPriceEnd = price.special_price_end;
    const currentDate = new Date();

if (specialPrice && specialPriceStart <= currentDate && currentDate <= specialPriceEnd) {
  // Apply the special price
  await updatePrdPrice(priceId, { product_price: specialPrice });
} else {
  // Revert to the regular price
  await updatePrdPrice(priceId, { product_price: currentPrice });
}
  
      const specialPriceValue = price.special_price;
      await updatePriceHistory({ price_id: priceId, product_price: currentPrice, special_price: specialPrice, special_price_type: specialPriceValue, special_price_start: specialPriceStart, special_price_end: specialPriceEnd, user_id: req.user?.id });

    res.status(201).json({
      status: 201,
      success: true,
      message: "update successfully",
      result: updatePrdPrice
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to update, something went wrong",
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


// price history






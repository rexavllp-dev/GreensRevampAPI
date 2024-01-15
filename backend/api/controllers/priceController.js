import { createPrdPrice, deletePrdPrice, getAllPrdPrice, getPrdPrice, updatePrdPrice } from "../models/productPriceModel.js";


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
  const { id } = req.params;
  const priceData = req.body;
  try {
    const updatePrice = await updatePrdPrice(id, priceData);
    res.status(201).json({
      status: 201,
      success: true,
      message: "update successfully",
      result: updatePrice
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


// delete prices

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
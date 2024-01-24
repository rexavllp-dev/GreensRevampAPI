import { createInventory, getProductInventorybyId, getProductQuantity, updateInventory, updateProductQuantity } from "../models/inventoryModel.js";
import { joiOptions } from '../helpers/joiOptions.js';
import Joi from 'joi';
import getErrorsInArray from '../helpers/getErrors.js';



// create inventory
export const createProductInventory = async (req, res) => {


  const {

    product_id,
    sku,
    inventory_management,
    product_quantity,
    stock_availability,
    show_out_of_stock_on_dashboard,
    back_in_stock,
    best_seller,

  } = req.body;

  try {

    const schema = Joi.object({
      product_id: Joi.number().integer().required().label(" product_id"),
      sku: Joi.string().required().label("sku"),
      inventory_management: Joi.boolean().required().label("inventory_management"),
      product_quantity: Joi.number().required().label("product_quantity"),
      stock_availability: Joi.string().required().label("stock_availability"),
      show_out_of_stock_on_dashboard: Joi.boolean().label("show_out_of_stock_on_dashboard"),
      back_in_stock: Joi.boolean().required().label("back_in_stock"),
      best_seller: Joi.boolean().label("best_seller"),

    });



    // product validation data

    const validate_data = {

      product_id,
      sku,
      inventory_management,
      product_quantity,
      stock_availability,
      show_out_of_stock_on_dashboard,
      back_in_stock,
      best_seller,


    };

    const { error } = schema.validate(validate_data, joiOptions);
    if (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Validation Error",
        error: getErrorsInArray(error?.details),
      });
    };


    // create a product
    const newInventory = await createInventory({

      product_id,
      sku,
      inventory_management,
      product_quantity,
      stock_availability,
      show_out_of_stock_on_dashboard,
      back_in_stock,
      best_seller,

    })

    res.status(201).json({
      status: 201,
      success: true,
      message: "Inventory created successfully",
      data: newInventory
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      success: false,
      error: error,
      message: "Failed to Create Inventory! Please try again later."
    });
  }

};

// update inventory

export const updateProductInventory = async (req, res) => {

  const { productId } = req.params;
  const inventoryData = req.body;

  try {

    const product = await getProductInventorybyId(productId);



    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product Inventory not found',
      });
    };


    //  update the inventory
    await updateInventory(productId, inventoryData);

    res.status(201).json({
      status: 201,
      success: true,
      message: "update successfully",
      result: inventoryData,
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


export const addStock = async (req, res) => {
  const productId = req.params.productId;
  const { quantityToAdd } = req.body;

  try {
    const currentQuantity = await getProductQuantity(productId);
    if (currentQuantity !== null) {
      const newQuantity = currentQuantity + quantityToAdd;
      await updateProductQuantity(productId, newQuantity);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Stock added successfully",
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to add stock, something went wrong",
      error: error
    });
  }
};


export const reduceStock = async (req, res) => {
  const productId = req.params.productId;
  const { quantityToReduce } = req.body;
  try {
    const currentQuantity = await getProductQuantity(productId);
    if (currentQuantity !== null) {
      const newQuantity = currentQuantity - quantityToReduce;
      await updateProductQuantity(productId, newQuantity);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Stock reduced successfully",
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to reduce stock, something went wrong",
      error: error
    });
  }
};
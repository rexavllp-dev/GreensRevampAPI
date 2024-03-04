import { createInventory, getProductInventoryById, getProductQuantity, updateInventory, updateProductQuantity } from "../models/inventoryModel.js";
import { joiOptions } from '../helpers/joiOptions.js';
import Joi from 'joi';
import getErrorsInArray from '../helpers/getErrors.js';
import { updateAProduct } from "../models/productModel.js";
import { getBulkRangesByProductId } from "../models/bulkModel.js";




// create inventory
export const createProductInventory = async (req, res) => {


  const {

    product_id,
    sku,
    ein_code,
    inventory_management,
    product_quantity,
    stock_availability,
    show_out_of_stock_on_dashboard,
    back_in_stock,
    best_seller,
    max_qty,
    min_qty,
    item_code

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


    let updatedStockAvailability = stock_availability;

    if (product_quantity > 0) {
      updatedStockAvailability = "In stock";
    } else if (product_quantity === 0) {
      // If product_quantity is 0, update stock_availability to "Out of stock"
      updatedStockAvailability = "Out of stock";
    }



    // create a product
    const newInventory = await createInventory({

      product_id,
      sku,
      inventory_management,
      product_quantity,
      stock_availability: updatedStockAvailability,
      show_out_of_stock_on_dashboard,
      back_in_stock,
      best_seller,
      max_qty,
      min_qty,
    })

    const updatedProduct = await updateAProduct(product_id, {
      ein_code,
      item_code
    });

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

  const {
    sku,
    ein_code,
    inventory_management,
    product_quantity,
    stock_availability,
    show_out_of_stock_on_dashboard,
    back_in_stock,
    best_seller,
    max_qty,
    min_qty,
    item_code,
  } = req.body;

  try {

    const product = await getProductInventoryById(productId);



    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Product Inventory not found',
      });
    };


    // Check if there are bulk discount ranges set for this product
     // Check if there are existing bulk discount ranges for the product
     const existingBulks = await getBulkRangesByProductId(productId);

     if (existingBulks.length > 0 && max_qty < existingBulks[existingBulks.length - 1].end_range) {
       return res.status(400).json({
         status: 400,
         success: false,
         message: `Warning: Reducing the maximum quantity below the end range of a bulk discount may affect existing discounts. Please consider updating the bulk ranges accordingly.`,
       });
     }


     let updatedStockAvailability = stock_availability;

     if (product_quantity > 0) {
      updatedStockAvailability = "In stock";
    } else if (product_quantity === 0) {
      // If product_quantity is 0, update stock_availability to "Out of stock"
      updatedStockAvailability = "Out of stock";
    }


    //  update the inventory
    await updateInventory(productId, {
      sku,
      inventory_management,
      product_quantity,
      stock_availability : updatedStockAvailability,
      show_out_of_stock_on_dashboard,
      back_in_stock,
      best_seller,
      max_qty,
      min_qty
    });

    const updatedProduct = await updateAProduct(productId, {
      ein_code,
      item_code
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "update successfully",
      result: [],
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



// Add or reduce stock
export const modifyStock = async (req, res) => {
  const productId = req.params.productId;
  const { action, quantity, comment } = req.body;

  try {
    const currentQuantity = await getProductQuantity(productId);

    if (currentQuantity !== null) {
      let newQuantity;

      if (action === 'add') {
        newQuantity = currentQuantity + parseInt(quantity);

      } else if (action === 'reduce') {
        newQuantity = currentQuantity - parseInt(quantity);

        if (newQuantity < 0) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: "Cannot reduce quantity below 0",
          });
        };

      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid action. Use 'add' or 'reduce'.",
        });
      }

      await updateProductQuantity(productId, newQuantity, comment);

      return res.status(200).json({
        status: 200,
        success: true,
        message: `Stock ${action === 'add' ? 'added' : 'reduced'} successfully`,
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
      message: "Failed to modify stock, something went wrong",
      error: error,
    });
  }
};



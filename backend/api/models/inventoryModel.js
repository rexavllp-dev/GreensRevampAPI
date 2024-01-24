import db from '../../config/dbConfig.js';

export const createInventory = async (inventoryData) => {
    const newInventory = await db('product_inventory').insert(inventoryData).returning('*')
    return newInventory;
}

export const updateInventory = async (productId, inventoryData) => {

    const updatedInventory = await db('product_inventory').where({ product_id: productId })
        .update(inventoryData).returning('*')
    return updatedInventory;
};

export const getProductInventorybyId = async (productId) => {
    const inventory = await db('product_inventory')
        .select('*')
        .where({ product_id: productId })
        .first();

    return inventory;
};


// export const addStock = async (productId, stockData) => {
//     const newStock = await db('product_inventory').where({ product_id: productId }).update(stockData).returning('*');
//     return newStock;
// };


export const getProductQuantity = async (productId) => {
    const result = await db('product_inventory')
      .where('product_id', productId)
      .select('product_quantity')
      .first();
  
    return result ? result.product_quantity : null;
  };
  
  
  // Reduce Stock Function
  export const updateProductQuantity = async (productId, newQuantity) => {
    const updatedQuantity = await db('product_inventory')
      .where('product_id', productId)
      .update({ product_quantity: newQuantity });
  
    return updatedQuantity;
  };
  







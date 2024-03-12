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

export const getProductInventoryById = async (productId) => {
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
export const updateProductQuantity = async (productId, newQuantity, comment) => {
  // Get the current stock before updating
  const currentStock = await getProductQuantity(productId);

  const updatedQuantity = await db('product_inventory')
    .where('product_id', productId)
    .update({ product_quantity: newQuantity });

  // Determine the action based on the change in stock
  const action = newQuantity >= currentStock ? 'add' : 'reduce';

  await db('stock_history').insert({
    product_id: productId,
    previous_stock: currentStock,
    qty: Math.abs(newQuantity - currentStock),
    remaining_stock: newQuantity,
    comment: comment,
    action: action === 'add' ? 'New Stock added to main' : 'New Stock reduced to main',
    created_at: new Date(),
    updated_at: new Date(),
  });

};






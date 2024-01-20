import db from '../../config/dbConfig.js';

export const createInventory = async (inventoryData) => {
    const newInventory = await db('product_inventory').insert(inventoryData).returning('*')
    return newInventory;
}

export const updateInventory = async (productId,inventoryData) => {

    const updatedInventory = await db('product_inventory').where({product_id: productId})
    .update(inventoryData).returning('*')
    return updatedInventory;
}

export const getProductInventorybyId = async (productId) => {
    const inventory = await db('product_inventory')
        .select('*')
        .where({ product_id: productId })
        .first();

    return inventory;
}




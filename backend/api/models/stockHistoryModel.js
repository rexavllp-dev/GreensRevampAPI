import db from '../../config/dbConfig.js';


export const createStockHistory = async (stockHistoryData) => {
    const newStockHistory = await db('stock_history')
        .insert(stockHistoryData)
        .returning('*');

    return newStockHistory;
};

// get all stock history 
export const getAllStockHistory = async (product_id) => {

    const stockHistory = await db('stock_history')
        .leftJoin('products', 'stock_history.product_id', 'products.id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .where({ 'stock_history.product_id': product_id }).select('stock_history.*', 'products.prd_name', 'product_inventory.sku');
    return stockHistory;
};


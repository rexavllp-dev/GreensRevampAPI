import db from '../../config/dbConfig.js';

// get all stock history 


export const getAllStockHistory = async () => {

    const stockHistory = await db('stock_history').select('*');
    return stockHistory;
}


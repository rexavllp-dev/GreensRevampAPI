import db from '../../config/dbConfig.js';

export const createATransaction = async (transactionData) => {
    const transaction = await db('transactions').insert(transactionData);
    return transaction;
};


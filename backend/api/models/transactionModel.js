import db from '../../config/dbConfig.js';

export const createATransaction = async (transactionData) => {
    const transaction = await db('transactions').insert(transactionData);
    return transaction;
};

//find transaction
export const findTransaction = async ({ order_id }) => {
    const transaction = await db('transactions').where({ order_id });
    return transaction;
};

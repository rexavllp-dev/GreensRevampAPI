import db from "../../config/dbConfig.js";

export const createReturnPrd = async (userId, returnData) => {
    const newReturn = await db('return_products')
        .insert({

            user_id: userId,
            order_item_id: returnData.order_item_id,
            reason_id: returnData.reason_id,
            return_comment: returnData.return_comment,

        })

        .returning('*')
    return newReturn;
};


export const addReturnImage = async (returnId, imageUrl) => {
    console.log(returnId, imageUrl);
    await db('return_gallery')
        .insert({
            return_id: returnId,
            url: imageUrl
        });
};


export const getAllReturnProducts = async () => {
    const returns = await db('return_products')
        .select('*')
    return returns;
}
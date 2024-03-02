import db from "../../config/dbConfig.js";

export const createReplacePrd = async (userId, replaceData) => {
    const newReplace = await db('replace_products')
        .insert({

            user_id: userId,
            order_item_id: replaceData.order_item_id,
            reason_id: replaceData.reason_id,
            replace_qty: replaceData.replace_qty,
            replace_comment: replaceData.replace_comment,

        })

        .returning('*')
    return newReplace;
};


export const addReplaceImage = async (replaceId, imageUrl) => {
    return await db('replacement_gallery')
        .insert({
            replace_id: replaceId,
            url: imageUrl
        });
};



export const getReturnById = async (returnId) => {
    const returnData = await db('return_products')
        .where({ id: returnId })
        .select('*')
        .first();

    return returnData;
};


export const getAllReturnProducts = async () => {
    const returns = await db('return_products')
        .leftJoin('order_items', 'return_products.order_item_id', 'order_items.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('reasons', 'return_products.reason_id', 'reasons.id')
        .select(


            'order_items.id as orderItemId',
            'order_items.created_at as orderItemCreatedAt',


            'products.prd_name',

            'return_products.return_comment',

            'reasons.clr_reason'

        )
    return returns;
};
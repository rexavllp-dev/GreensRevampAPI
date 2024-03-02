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
    return await db('return_gallery')
        .insert({
            return_id: returnId,
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
        .leftJoin('return_gallery', 'return_products.id', 'return_gallery.return_id')
        .select(


            'order_items.id as orderItemId',
            'order_items.created_at as orderItemCreatedAt',


            'products.prd_name',

            'return_products.return_comment',

            'reasons.clr_reason',

            db.raw(`
            jsonb_agg(
                jsonb_build_object(
                    
                    'id', return_gallery.id,
                    'url', return_gallery.url
                )
            ) FILTER (WHERE return_gallery.id IS NOT NULL) AS returnImages
        `)

        )

        .groupBy(

            'order_items.id',
            'order_items.created_at',

            'products.prd_name',

            'return_products.return_comment',

            'reasons.clr_reason',


        );

    

    return returns;
};



export const updateReturnStatusByAdmin = async (returnId, status) => {
    return await db('return_products')
        .where({ id: returnId })
        .update({ return_status: status });
};
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



export const getReplacementById = async (replaceId) => {
    const replaceData = await db('replace_products')
        .where({ id: replaceId })
        .select('*')
        .first();

    return replaceData;
};



export const getAllReplacementProducts = async () => {

    const replacements = await db('replace_products')
        .leftJoin('order_items', 'replace_products.order_item_id', 'order_items.id')
        .leftJoin('products', 'order_items.product_id', 'products.id')
        .leftJoin('reasons', 'replace_products.reason_id', 'reasons.id')
        .leftJoin('replacement_gallery', 'replace_products.id', 'replacement_gallery.replace_id')
        .select(


            'order_items.id as orderItemId',
            'order_items.op_qty',
            'order_items.created_at as orderItemCreatedAt',


            'products.prd_name',

            'replace_products.replace_comment',

            'reasons.clr_reason',

            db.raw(`
            jsonb_agg(
                jsonb_build_object(
                    
                    'id', replacement_gallery.id,
                    'url', replacement_gallery.url 
                ) ORDER BY replacement_gallery.id ASC
            ) FILTER (WHERE replacement_gallery.id IS NOT NULL) AS replacementImages
        `)

        )

        .groupBy(

            'order_items.id',
            'order_items.op_qty',
            'order_items.created_at',

            'products.prd_name',

            'replace_products.replace_comment',

            'reasons.clr_reason',


        );


    return replacements;
};

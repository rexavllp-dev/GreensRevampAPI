import db from '../../config/dbConfig.js';


export const createProductOption = async (optionData) => {
    const productOption = await db('product_options').insert(optionData).returning('*');
    return productOption;
};


// update option label
export const updateOptionLabel = async (product_optionId, option_label) => {

    const updatedOption = await db('product_options')
    .where({
        id: product_optionId
    })
    .update({ option_label })
    .returning('*');
    return updatedOption;
};



// delete option label
export const deleteAOptionLabel = async (product_optionId) => {
    const deleteOption = db('product_options').where({ id: product_optionId }).del();
    return deleteOption;
};




export const getOptionValuesByOptionId = async (optionId) => {

    const option = await db('product_options')
        .leftJoin('options', 'product_options.option_id', 'options.id')
        .leftJoin('products', 'product_options.product_id', 'products.id')
        .leftJoin('product_inventory', 'products.id', 'product_inventory.product_id')
        .select(
            'product_options.*',
            'product_options.id as product_option_id',
            'options.*',
            'options.id as option_id',
            'products.*',
            'products.id as product_id',
            "product_inventory.*",
            "product_inventory.id as product_inventory_id",

        )
        .where({
            "product_options.option_id": optionId,
        });
    console.log(optionId);
    return option;
};


export const checkOptionLabelExist = async (productId) => {
    const option = await db('product_options')
        .where({

            product_id: productId,
        })
        .select('*')
    return option;
}


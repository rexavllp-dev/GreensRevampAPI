import db from '../../config/dbConfig.js';

export const createProductOption = async (optionData) => {
    const productOption = await db('product_options').insert(optionData).returning('*');
    return productOption;
};


export const getOptionLabel = async (optionId, productId) => {
    console.log(optionId, productId);
    const option = await db('product_options')
        .select(
            'option_label',
            'product_id',
            'option_id',
        )
        .where({
            option_id: optionId,
            product_id: productId
        });
    return option;
};

// update option label
export const updateOptionLabel = async ( product_optionId, option_label) => {
    const updatedOption = await db('product_options')
        .where({
            id: product_optionId
        })
        .update(option_label)
        .returning('*');
    return updatedOption;
};

// delete option label
export const deleteAOptionLabel = async (product_optionId) => {
    const deleteOption = db('product_options').where({ id: product_optionId }).del();
    return deleteOption;
}
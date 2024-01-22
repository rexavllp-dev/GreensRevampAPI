import db from '../../config/dbConfig.js';


export const createProductOption = async (optionData) => {
    const productOption = await db('product_options').insert(optionData).returning('*');
    return productOption;
};


export const getOptionLabel = async (optionId) => {
    
    const option = await db('product_options')
        .leftJoin('options', 'product_options.option_id', 'options.id')
        .select(
            'product_options.*',
            'product_options.id as product_option_id',
            'options.*',
            'options.id as option_id',
        )
        .where({
            "options.id": optionId,
           
        });
    return option;
};

// update option label
export const updateOptionLabel = async (product_optionId, option_label) => {
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


export const getOptionsByProductId = async (productId) => {
    const options = await db('product_options')
        .leftJoin('options', 'product_options.option_id', 'options.id')
        .where({
            'product_options.product_id': productId
        })
        .select(
        
            'options.*',
    
        )

    return options
};






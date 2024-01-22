import db from '../../config/dbConfig.js';


export const createOption = async (optionData) => {
    const option = await db('options').insert(optionData).returning('*');
    return option;
};

export const  getOptionByProductId = async (optionId) => {
    const option = await db('options').select('*').where({ id: optionId }).first();
    return option;
};


export const getOptions = async () => {
    const options = await db('options').select('*');
    return options;
};


export const deleteAOption = async (optionId) => {
    const deleteOption = db('options').where({ id: optionId }).del();
    return deleteOption;
};

export const getOptionsWithProductId = async (productId) => {
    const options = await db('product_options')
        .leftJoin('options', 'product_options.option_id', 'options.id')
        .where({
            'product_options.product_id': productId
        })
        .select(
        
            'options.*',
    
        )

    return options;
};
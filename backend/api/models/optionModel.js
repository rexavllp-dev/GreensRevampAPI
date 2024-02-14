import db from '../../config/dbConfig.js';


export const createOption = async (optionData) => {
    const option = await db('options').insert(optionData).returning('*');
    return option;
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

export const getAllOptionsByProductId = async (productId) => {
    const optionsArray = await db('product_options')
        .leftJoin('options', 'product_options.option_id', 'options.id')
        .where({
            'product_options.product_id': productId
        })
        .select(
            'options.*',
        )
        .orderBy('options.created_at', 'asc');

    // Assuming your optionsArray contains rows with option data

    const optionsWithItems = [];

    // Iterate over each option and fetch its inner items
    for (const option of optionsArray) {
        const innerItems = await db('product_options')
            .where({
                'product_options.option_id': option.id
            })
            .select('product_options.*');

        // Add inner items to the option
        option.innerItems = innerItems;

        // Add the option to the final array
        optionsWithItems.push(option);
    }

    return optionsWithItems;
};

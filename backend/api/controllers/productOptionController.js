import { checkOptionLabelExist, createProductOption, deleteAOptionLabel, getOptionValuesByOptionId, updateOptionLabel } from "../models/productOptionModel.js";


export const addProductOptionValues = async (req, res) => {
    const { optionId, optionValues } = req.body;
    try {

        let repeatedProducts = [];

        // let optionData = optionValues.map((value) => {

        //     return { option_id: optionId, option_label: value.option_label, product_id: value.product_id };
        // });

        let optionData = [];
        for (let i = 0; i < optionValues.length; i++) {
            const isOptionLabelExist = await checkOptionLabelExist( optionValues[i].product_id); 

            if(isOptionLabelExist.length > 0) {
                repeatedProducts.push(optionValues[i]);
                console.log(isOptionLabelExist);
                continue;
            }

            optionData.push({
                option_id: optionId,
                option_label: optionValues[i].option_label,
                product_id: optionValues[i].product_id
            });
        }
        console.log("option data",optionData)

        let  productOptions;
        if(optionData.length !== 0) {
            productOptions = await createProductOption(optionData);
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: "Option values added successfully",
            result: productOptions
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to add option values",
            error: error
        });
    }
};



//  updated option
export const updateAOptionLabel = async (req, res) => {
    const { product_options } = req.body;
    
    try {

        const updatedOptions = [];
       
        for (const { product_optionId, option_label } of product_options) {
            const updatedOption = await updateOptionLabel(product_optionId, option_label);
            updatedOptions.push(updatedOption);
        };

        if (updatedOptions.length > 0) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Option label updated successfully",
                result: updatedOptions
            });
        };

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update option label",
            error: error
        });
    }
};


// get option values by option id
export const getOptionsValues = async (req, res) => {
    const optionId = req.params.optionId;
    console.log(optionId);
    try {
        const option = await getOptionValuesByOptionId(optionId);
        console.log(option);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Option values retrieved successfully",
            result: option
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to get option values",
            error: error
        });
    }
};


//  update all option label


//  delete option
export const deleteOptionLabel = async (req, res) => {
    const product_optionId = req.params.product_optionId;
    try {
        const deleteOption = await deleteAOptionLabel(product_optionId);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Option label deleted successfully",
            result: deleteOption
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to delete option label",
            error: error
        });
    }
};
import { createProductOption, deleteAOptionLabel, updateOptionLabel } from "../models/productOptionModel.js";


export const addProductOptionValues = async (req, res) => {
    const { optionId, optionValues } = req.body;
    try {

        let optionData = optionValues.map((value) => {

            return { option_id: optionId, option_label: value.option_label, product_id: value.product_id };
        });
        console.log(optionData)

        const productOptions = await createProductOption(optionData);

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


// get option label by product id
// export const getOptionsByProductId = async (req, res) => {
//     const  productId = req.params;
   
//     try {
//         const options = await getOptionsWithProductId(productId);
//         console.log(options);
//         res.status(200).json({
//             status: 200,
//             success: true,
//             message: "Fetched option successfully",
//             result: options
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: "Failed to fetch option",
//             error: error
//         });
//     }
// };


//  updated option
export const updateAOptionLabel = async (req, res) => {
    const product_optionId = req.params.product_optionId;
    const option_label = req.body;
    try {
        const updatedOption = await updateOptionLabel(product_optionId, option_label);

        if (updatedOption.length > 0) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Option label updated successfully",
                result: updatedOption
            });
        } else {
            res.status(404).json({ success: false, message: 'Option not found' });
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


//  updated option
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
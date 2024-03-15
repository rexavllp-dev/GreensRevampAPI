import { createAStore, getAStore,  getsAllStore,  updateAStore } from "../models/adminStoreModel.js";



export const createStore = async (req, res) => {
    const storeData = req.body;

    try {

        const newStore = await createAStore(storeData);


        res.status(200).json({
            status: 200,
            success: true,
            message: "Store created successfully",
            result: newStore
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create store",
            error: error
        });
    }
};




export const updateStore = async (req, res) => {

    const storeId = req.params.storeId;
    const storeData = req.body;

    try {

        const updatedStore = await updateAStore(storeId, storeData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store updated successfully",
            result: updatedStore
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update store",
            error: error
        });
    }
};



export const getStore = async (req, res) => {
    const storeId = req.params.storeId;

    try {

        const store = await getAStore(storeId);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store fetched successfully",
            result: store
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch store",
            error: error
        });
    }
};


export const getAllStore = async (req, res) => {

    try {

        const stores = await getsAllStore();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Store fetched successfully",
            result: stores
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch store",
            error: error
        });
    }
};
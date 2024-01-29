import { createSearchHistory, getAllSearch } from "../models/searchHistoryModel.js";



export const createNewSearchHistory = async (req, res) => {
    const searchData = req.body;
    try {
        const searchHistory = await createSearchHistory(searchData);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Search history created successfully",
            result: searchHistory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create search history",
            error: error
        });
    }
};


export const getAllSearchHistory = async (req, res) => {
    try {
        const searchHistory = await getAllSearch();
        res.status(200).json({
            status: 200,
            success: true,
            message: "Search history fetched successfully",
            result: searchHistory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to fetch search history",
            error: error
        });
    }
};
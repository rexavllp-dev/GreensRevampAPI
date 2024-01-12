import { createPrdPrice } from "../models/productModel.js";


// create price
export const createPrice = async (req,res) => {
    const  priceData  = req.body;
    try {
        const newPrice = await createPrdPrice(priceData);
        res.status(201).json({
          status:201,
          success:true,
          message:"Price added successfully",
          result: newPrice,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
          status:500,
          success:false,
          message:"Failed something went wrong",
        });
    }
}
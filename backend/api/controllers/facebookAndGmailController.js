import { generateAccessToken, generateRefreshToken } from "../utils/token.js";


export const googleAuth = async (req,res) => {
    try {

        const accessToken = generateAccessToken(req.user)
        const refreshToken = generateRefreshToken(req.user)

        console.log(req.user);
        res.status(201).json({
          status:201,
          success:true,
          message:"success",
          result:{ accessToken, refreshToken }
        });
    } catch (error) {
        console.log(error);
    }
};


export const facebookAuth = async (req,res) => {
    try {

        const accessToken = generateAccessToken(req.user)
        const refreshToken = generateRefreshToken(req.user)

        console.log(req.user);
        res.status(201).json({
          status:201,
          success:true,
          message:"success",
          result:{ accessToken, refreshToken }
        });
    } catch (error) {
        console.log(error);
    }
};
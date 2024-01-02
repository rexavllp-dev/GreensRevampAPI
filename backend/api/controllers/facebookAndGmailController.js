
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";


export const googleAuth = async (req, res) => {
    try {


     
        const accessToken = generateAccessToken(req.user)
        const refreshToken = generateRefreshToken(req.user)

        console.log(req.user)

        // res.status(201).json({
        //   status:201,
        //   success:true,
        //   message:"success",
        //   result:{ accessToken, refreshToken }
        // });
        res.redirect(`http://localhost:3000/auth/success?access_token=${accessToken}&refresh_token=${refreshToken}&usr_firstname=${req.user.usr_firstname}&usr_lastname=${req.user.usr_lastname}&usr_email=${req.user.usr_email}`);
    } catch (error) {
        console.log(error);
    }
};


export const facebookAuth = async (req, res) => {
    try {

    

        const accessToken = generateAccessToken(req.user)
        const refreshToken = generateRefreshToken(req.user)


        res.redirect(`http://localhost:3000/auth/success?access_token=${accessToken}&refresh_token=${refreshToken}&usr_firstname=${req.user.usr_firstname}&usr_lastname=${req.user.usr_lastname}&usr_email=${req.user.usr_email}`);
        // res.status(201).json({
        //   status:201,
        //   success:true,
        //   message:"success",
        //   result:{ accessToken, refreshToken }
        // });
    } catch (error) {
        console.log(error);
    }
};
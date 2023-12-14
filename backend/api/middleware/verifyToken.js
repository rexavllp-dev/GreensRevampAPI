import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()


//verify token


export const authenticate = async (req, res, next) => {
    //get token from headers
    const authToken = req.headers.authorization


     //check token is exist or not
     if (!authToken || !authToken.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: 'No token, authorized denied' });
    }

    try {
        const token = authToken.split(" ")[1];

        //verify token 
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next();
        
} catch (error) {
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token is expired , please login again" });
    }

   // console.log(error)

    return res
    
            .status(401)
            .json({ success: false, message: "Invalid token" });
}

}    


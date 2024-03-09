import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const checkIfLoggedIn = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header("Authorization")?.split(" ")[1]
//  console.log(token)
    // If the token is not found, send a 401 Unauthorized response
    if (!token) {
        req.user = {
            id: null
        };
        next();
    }

    // If the token is found, verify it using the JWT secret
    else {
        jwt.verify(token, process.env.JWT_ACCESS, (err, decoded) => {
            // If the token is invalid, send a 401 Unauthorized response
            if (err) {
                console.log(err)
                res.status(401).json({ auth: false, message: "Invalid token" });
            }
            // If the token is valid, set the user object in the request and proceed to the next middleware
            else {
                req.user = decoded;
                next();
            }
        })
    }
}

export default checkIfLoggedIn;
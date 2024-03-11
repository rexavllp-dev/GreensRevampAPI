
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const verifyLogged = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]
    if (!token) {
        req.user = null;
        next();
    }

    else {
        jwt.verify(token, process.env.JWT_ACCESS, (err, decoded) => {
            if (err) {
                // res.status(401).json({ status: 401, auth: false, message: "Invalid token" });
                req.user = null;
                next();
            }
            else {
                req.user = decoded;
                next();
            }
        })
    }
}

export default verifyLogged;
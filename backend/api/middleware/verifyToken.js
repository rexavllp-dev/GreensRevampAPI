
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config()

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]

    if (!token) {
        res.status(401).json({ status: 401, auth: false, message: "Authentication failed. Token not found" });
    }

    else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ status: 401, auth: false, message: "Invalid token" });
            }
            else {
                req.user = decoded;
                next();
            }
        })
    }
}

export default verifyToken;
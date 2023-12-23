import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const validateAuth = (token) => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.EMAIL_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                reject("Invalid token")
            }
            else {

                resolve(decoded)

            }
        })
    })
}

export default validateAuth;
import jwt from 'jsonwebtoken';




export const generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS, { expiresIn: '5m' });
}

export const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH, { expiresIn: '25d' });
}
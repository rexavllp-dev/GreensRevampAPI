import jwt from 'jsonwebtoken';



export const generateAccessToken = (user) => {
    return jwt.sign({ userId: user?.id, usr_email: user?.usr_email, name: user?.usr_firstname, is_role: user?.is_role }, process.env.JWT_ACCESS, { expiresIn: '25d' });
}

export const generateRefreshToken = (user) => {
    return jwt.sign({  userId: user?.id, usr_email: user?.usr_email, name: user?.usr_firstname, is_role: user?.is_role }, process.env.JWT_REFRESH, { expiresIn: '25d' });
}  


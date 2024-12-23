import jwt from 'jsonwebtoken';
import ENVIROMENT from '../config/enviroment.config.js';

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, ENVIROMENT.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

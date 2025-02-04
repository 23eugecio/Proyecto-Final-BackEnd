import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';


export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

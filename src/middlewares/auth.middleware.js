import jwt from 'jsonwebtoken';
import ResponseBuilder from '../utils/Builders/responseBuilder.js';
import ENVIRONMENT from '../config/environment.config.js';

import jwt from "jsonwebtoken"
import ENVIROMENT from "../config/enviroment.config.js"

export const authMiddleware = (req, res, next) =>{
    try{
        const auth_header = req.headers.authorization
        if(!auth_header || !auth_header.startsWith('Bearer ')){
            return res.status(401).json({
                ok: false,
                status: 401,
                message: 'Unauthorized'
            })
        }
        const auth_token = auth_header.split(' ')[1]
        const decoded_token = jwt.verify(auth_token, ENVIROMENT.SECRET_KEY)
        req.user = decoded_token
        return next()
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            status: 500,
            message: 'Internal server error'
        })
    }
}

// Middleware de verificación de API Key
export const verifyApiKeyMiddleware = (req, res, next) => {
    try {
        const apikey_headers = req.headers['x-api-key'];

        if (!apikey_headers || apikey_headers !== ENVIRONMENT.API_KEY_INTERN) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Unauthorized')
                .setStatus(401)
                .setPayload({ detail: 'Invalid or missing API Key' })
                .build();
            return res.status(401).json(response);
        }

        next();
    } catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setMessage('Internal server error')
            .setStatus(500)
            .setPayload({ detail: 'Internal server error' })
            .build();
        return res.status(500).json(response);
    }
};

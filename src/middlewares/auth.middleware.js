import ENVIROMENT from "../config/enviroment.config.js";
import ResponseBuilder from "../utils/Builders/responseBuilder.js";
import jwt from "jsonwebtoken";



export const authMiddleware = (roles_permitidos = []) => {

    return (req, res, next) => {
        try {
            const auth_header = req.headers['authorization']

            if (!auth_header) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setStatus(401)
                    .setMessage('Unauthorized, missing token')
                    .setPayload({
                        detail: 'Expecting Authorization Token'
                    })
                    .build()

                return res.status(401).json(response);
            }

            const access_token = auth_header.split(' ')[1]
            if (!access_token) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setStatus(401)
                    .setMessage('Token authorized ')
                    .setPayload({
                        detail: 'Expecting Authorization Token'
                    })
                    .build()
                return res.status(401).json(response);
            }
            const decoded = jwt.verify(access_token, ENVIROMENT.JWT_SECRET)

            req.user = decoded

            if(roles_permitidos.length && !roles_permitidos.includes(req.user.role)){
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setStatus(403)
                    .setMessage('Forbidden')
                    .setPayload({
                        detail: 'You do not have permission to access this resource'
                    })
                    .build()

                return res.status(401).json(response);
        }
        return next()
        }
        catch (error) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Internal server error')
                .setPayload({
                    detail: error.message
                })
                .build()
            return res.status(401).json(response);
        }
    }

}

export const verifyApiKeyMiddleware = (req, res, next) => {
    try {
        const apikey_header = req.headers['x-api-key']
        if (!apikey_header) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Unauthorized, missing ApiKey access')
                .setPayload({
                    detail: 'Expecting Authorization ApyKey'
                })
                .build()

            return res.status(401).json(response);
        }
        if (apikey_header !== ENVIROMENT.API_KEY_INTERN) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Unauthorized, ApiKey not valid')
                .setPayload({
                    detail: 'Expecting valid ApyKey'
                })
                .build()

            return res.status(401).json(response);
        }
        return next()
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: 'Error verifying ApiKey'
            })
            .build()
        return res.status(401).json(response);
    }
}

export default { authMiddleware, verifyApiKeyMiddleware }
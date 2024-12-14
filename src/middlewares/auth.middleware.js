import ENVIROMENT from "../config/enviroment.config.js"
import jwt from 'jsonwebtoken'
import ResponseBuilder from "../utils/builders/responseBuilder.js"



export const verifyTokenMiddleware = (user_permitidos = []) =>  {

    return (req, res, next) => {
        try {
            const auth_header = req.headers['authorization']

            if (!auth_header) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setMessage('Missing token')
                    .setStatus(401)
                    .setPayload({
                        detail: 'Wait for a valid token'
                    })
                    .build()

                return res.status(401).json(response)
            }
            const access_token = auth_header.split(' ')[1]
            if (!access_token) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setMessage('Malformed token')
                    .setStatus(401)
                    .setPayload({
                        detail: 'Malformed token'
                    })
                    .build()

                return res.status(401).json(response)
            }
            const decoded = jwt.verify(access_token, ENVIROMENT.JWT_SECRET)

            req.user = decoded

            if(user_permitidos.length &&  !user_permitidos.includes(req.user.role)){
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setMessage('You do not have permission to perform this operation')
                    .setStatus(403)
                    .setPayload({
                        detail: 'You do not have permission to perform this operation'
                    })
                    .build()

                return res.status(403).json(response)
            }

            return next() 
        }
        catch (error) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Authorization error')
                .setStatus(401)
                .setPayload(
                    {
                        detail: error.message
                    }
                )
                .build()
            return res.status(401).json(response)
        }
    }

}

export const verifyApiKeyMiddleware = (req, res, next) => {

    try {
        const apikey_header = req.headers['x-api-key']
        if (!apikey_header) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Unauthorized')
                .setStatus(401)
                .setPayload({
                    detail: 'Wait for a valid api-key'
                })
                .build()

            return res.status(401).json(response)
        }
        if (apikey_header !== ENVIROMENT.API_KEY_INTERN) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Unauthorized')
                .setStatus(401)
                .setPayload({
                    detail: 'Invalid api-key'
                })
                .build()

            return res.status(401).json(response)
        }

        return next()
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setMessage('Internal server error')
            .setStatus(500)
            .setPayload({
                detail: 'Internal server error'
            })
            .build()

        return res.status(500).json(response)
    }
}




import ENVIROMENT from "../config/enviroment.config.js"
import jwt from 'jsonwebtoken'
import ResponseBuilder from "../utils/Builders/responseBuilder.js"


export const verifyTokenMiddleware = (roles_permitidos = []) => {

    return (req, res, next) => {
        try {
            const auth_header = req.headers['authorization']

            if (!auth_header) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setMessage('Falta token de autorizacion')
                    .setStatus(401)
                    .setPayload({
                        detail: 'Se espera un token de autorizacion'
                    })
                    .build()

                return res.status(401).json(response)
            }
            const access_token = auth_header.split(' ')[1]
            if (!access_token) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setMessage('El token de autorizacion esta malformado')
                    .setStatus(401)
                    .setPayload({
                        detail: 'Se espera un token de autorizacion'
                    })
                    .build()

                return res.status(401).json(response)
            }
            const decoded = jwt.verify(access_token, ENVIROMENT.JWT_SECRET)

            req.user = decoded

            if(roles_permitidos.length &&  !roles_permitidos.includes(req.user.role)){
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setMessage('Acceso restringido')
                    .setStatus(403)
                    .setPayload({
                        detail: 'No tienes los permisos necesarios para realizar esta operacion'
                    })
                    .build()

                return res.status(403).json(response)
            }

            return next() 
        }
        catch (error) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Fallo al autentificar')
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

export const verifyApikeyMiddleware = (req, res, next) => {
    console.log('chau')
    try {
        const apikey_header = req.headers['x-api-key']
        if (!apikey_header) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Unauthorized')
                .setStatus(401)
                .setPayload({
                    detail: 'Se espera un api-key'
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
                    detail: 'Se espera un api-key valida'
                })
                .build()

            return res.status(401).json(response)
        }

        next()
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setMessage('Internal server error')
            .setStatus(500)
            .setPayload({
                detail: 'No se pudo validar la api-key'
            })
            .build()

        return res.status(500).json(response)
    }
}




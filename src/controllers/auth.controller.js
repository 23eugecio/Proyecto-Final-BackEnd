import ENVIROMENT from "../config/enviroment.config.js"
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../utils/mail.util.js"
import UserRepository from "../repositories/user.repository.js"
import ResponseBuilder from "../utils/Builders/responseBuilder.js"




export const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!email) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload(
                    {
                        detail: 'Invalid email'
                    }
                )
                .build()
            return res.status(400).json(response)
        }
        const existentUser = await User.findOne({ email: email })
        console.log({ existentUser })
        if (existentUser) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload(
                    {
                        detail: 'Email already exists!'
                    }
                )
                .build()
            return res.status(400).json(response)
        } 
            const verificationToken = jwt.sign(
                {
                    email: email
                }, ENVIROMENT.JWT_SECRET, {
                expiresIn: '1d'
            })
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            emailVerified: false
        })

        await newUser.save()


        const url_verification = `http://localhost:${ENVIROMENT.PORT}/api/auth/verify/${verificationToken}`
        await sendEmail({
            to: email,
            subject: 'Valida tu correo electronico',
            html: `
            <h1>Verificacion de correo electronico</h1>
            <p>Da click en el boton de abajo para verificar</p>
            <a 
                style='background-color: 'green'; color: 'white'; padding: 5px; border-radius: 5px;'
                href="${url_verification}"
            >Click aqui</a>
            `
        })


        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Created')
            .setPayload({})
            .build()
        return res.status(201).json(response)
    }
    catch (error) {
        if(error.code === 11000){
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload(
                    {
                        detail: 'Email already exists!'
                    }
                )
                .build()
                return res.json(response)
        }
        console.error('Error to register user: ', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload(
                {
                    detail: error.message,

                }
            )
            .build()
        return res.status(500).json(response)
    }

}


export const verifyMailValidationTokenController = async (req, res) => {
    try{
        const {verification_token} = req.params
        if(!verification_token){
            const response = new ResponseBuilder().setOk(false)
            .setStatus(400)
            .setPayload({
                'detail': 'Falta enviar token'
            })
            .build()
            return res.json(response)
        }

        const decoded = jwt.verify(verification_token, ENVIROMENT.JWT_SECRET)


        const user = await User.findOne({email: decoded.email})
        if(!user){

        }
        if(user.emailVerified){

        }

        user.emailVerified = true


        await user.save()
        const response = new ResponseBuilder()
        .setOk(true)
        .setMessage('Email verificado con exito')
        .setStatus(200)
        .setPayload({
            message: "Usuario validado"
        })
        .build()
        res.json(response)
    }   
    catch(error){
        console.error(error)
    }
}

export const loginController = async (req, res) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Usuario no encontrado')
            .setPayload({
                detail: 'El email no esta registrado'
            })
            .build()
            return res.json(response)
        }
        if(!user.emailVerified){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('Email no verificado')
            .setPayload(
                {
                    detail: 'Por favor, verifica tu correo electronico antes de iniciar sesion'
                }
            )
            .build()
            return res.json(response)
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(401)
            .setMessage('Credenciales incorrectas')
            .setPayload({
                detail: 'Contraseña incorrecta'
            })
            .build()
            return res.json(response)
        }
        const token = jwt.sign(
            {
                email: user.email, 
                id: user._id, 
                role: user.role
            }, 
            ENVIROMENT.JWT_SECRET, 
            { expiresIn: '1d'}
        )
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Logueado')
        .setPayload({
            token,
            user: {
                id:user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
        .build()
        res.json(response)
    }
    catch(error){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Internal server error')
        .setPayload({
            detail: error.message
        })
        .build()
        res.json(response)
    }
    
}


export const forgotPasswordController = async (req, res) => {
    try{
        const {email} = req.body

        console.log(email)
        const user = await UserRepository.obtenerPorEmail(email)
        if(!user){

        }
        const resetToken = jwt.sign({email: user.email}, ENVIROMENT.JWT_SECRET, {
            expiresIn: '1h'
        })

        const URL_FRONT = 'http://localhost:5173'
        const resetUrl = `${URL_FRONT}/reset-password/${resetToken}`
        sendEmail({
            to: user.email,
            subject: 'Restablecer contraseña',
            html: `
                <div>
                    <h1>Has solicitado restablecer tu contraseña</h1>
                    <p>Has click en el enlace de abajo para restablecer tu contraseña</p>
                    <a href='${resetUrl}'>Restablecer</a>
                </div>
            `
        })
        const response = new ResponseBuilder()
        response
        .setOk(true)
        .setStatus(200)
        .setMessage('Se envio el correo')
        .setPayload({
            detail: 'Se envio un correo electronico con las instrucciones para restablecer la contraseña.'
        })
        .build()
        return res.json(response)
    }
    catch(error){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Internal server error')
        .setPayload({
            detail: error.message
        })
        .build()
        res.json(response)
    }
}



export const resetTokenController = async (req, res) => {
    try {
        const { password } = req.body
        const { reset_token } = req.params

        if (!password) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Se requiere la nueva contraseña')
                .setPayload({
                    detail: 'Falta contraseña nueva'
                })
                .build()
            return res.json(response)
        }
        if (!reset_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Token Incorrecto')
                .setPayload({
                    detail: 'El reset_token expiro o no es valido'
                })
                .build()
            return res.json(response)
        }

        const decoded = jwt.verify(reset_token, ENVIROMENT.JWT_SECRET)

        console.log('Token decodificado:',decoded);

        if (!decoded) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Token Incorrecto')
                .setPayload({
                    detail: 'Fallo token de verificación'
                })
                .build()
            return res.json(response)
        }

        const { email } = decoded

        const user = await UserRepository.obtenerPorEmail(email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('No se encontro el usuario')
                .setPayload({
                    detail: 'Usuario inexistente o invalido'
                })
                .build()
            return res.json(response)
        }
        const encriptedPassword = await bcrypt.hash(password, 10);
        user.password = encriptedPassword
        await user.save()

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contraseña restablecida!')
            .setPayload({
                detail: 'Se actualizo la contraseña correctamente'
            })
        res.status(200).json(response)
    
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error interno del servidor',
            error: error.message,
        });
    }
}
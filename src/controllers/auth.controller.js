import ENVIROMENT from "../config/enviroment.config.js"
import User from "../models/user.model.js"
import ResponseBuilder from "../utils/Builders/responseBuilder.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/mail.util.js"
import UserRepository from "../repositories/user.repository.js"

export const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload(
                    {
                        detail: 'Name, Email and Password are required!'
                    }
                )
                .build()
            return res.status(400).json(response);
        }
        const existingUser = await UserRepository.obtenerPorEmail(email)
        if (existingUser) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload(
                    {
                        detail: 'User already exists!'
                    }
                )
                .build()
            return res.status(400).json(response);
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = jwt.sign({ email: email }, ENVIROMENT.JWT_SECRET, {
            expiresIn: '1d'
        })
        const url_verification = `http://localhost:${ENVIROMENT.PORT}/api/auth/verify/${verificationToken}`
        await sendEmail({
            to: email,
            subject: 'Verify your Email, please!',
            html: `
                <h1>Verify your email</h1>
                <p>Press the click button below to verify your account!</p>
                <a 
                    style='background-color: #604cc3; color: white; padding: 5px; border-radius: 8px; '
                    href="${url_verification}"
                >Click!</a>
            `
        })
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            emailVerified: false
        })

        await user.save()

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Created!')
            .setPayload({})
            .build()
        return res.status(201).json(response);
    }
    catch (error) {
        console.error('User register error:', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload(
                {
                    detail: error.message
                }
            )
            .build()
        return res.status(500).json(response);
    }

}


export const verifyMailValidationTokenController = async (req, res) => {
    try {
        const { verification_token } = req.params
        if (!verification_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(407)
                .setMessage('Bad request')
                .setPayload({
                    'detail': "Forgot to send the token"
                })
                .build()
            return res.status(407).json(response)
        }
        const decoded = jwt.verify(verification_token, ENVIROMENT.JWT_SECRET)
        const user = await UserRepository.obtenerPorEmail(decoded.email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Bad request')
                .setPayload({
                    'detail': "User not found"
                })
                .build()
            return res.status(404).json(response)
        }
        if (user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(201)
                .setMessage('Success! Email verified!')
                .setPayload({
                    detail: "User already verified"
                })
                .build()
            return res.status(201).json(response)
        }

        user.emailVerified = true
        await user.save()

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Success! Email verified!')
            .setPayload({
                message: 'You successfully verified your Email!'
            })
            .build()
        return res.json(response)
    }
    catch (error) {
        console.error('Verify email error!', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload(
                {
                    detail: error.message
                }
            )
            .build()
        return res.status(500).json(response);
    }
}


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserRepository.obtenerPorEmail(email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Not Found')
                .setPayload({
                    detail: 'Email is not register'
                })
                .build()
            return res.json(response)
        }
        if (!user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('Forbidden')
                .setPayload({
                    detail: 'Please, verify your account before you login!'
                })
                .build()
            return res.json(response)
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Invalid Password')
                .setPayload({
                    detail: 'Your password is invalid, enter the rigth one!!!'
                })
                .build()
            return res.json(response)
        }
        const token = jwt.sign({ email: user.email, id: user._id }, ENVIROMENT.JWT_SECRET, { expiresIn: '1d' })
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Logged!')
            .setPayload({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
            .build()
        return res.json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.json(response)
    }
}


/* export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email required!'
            });
        }
        const user = await UserRepository.obtenerPorEmail(email)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'There is no user with this Email!'
            });
        }
        const resetToken = jwt.sign({ email: user.email }, ENVIROMENT.JWT_SECRET, {
            expiresIn: '1h'
        })
        const resetUrl = `${URL_FRONT}/reset-password/${resetToken}`
        sendEmail({
            to: user.email,
            subject: 'Reset Password',
            html: `
            <div>
                <h1>You have requested to reset your password!</h1>
                <p>Click the button below to reset your password!!</p>
                <a href='${resetUrl}'>Reset Password</a>
            </div>
            `
        })
        const response = new ResponseBuilder()
        response
            .setOk(true)
            .setStatus(200)
            .setMessage('Success!')
            .setPayload({
                message: 'We have sent an email to reset your password!'
            })
            .build()
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error!!'
        });
    }
} */


/* export const resetTokenController = async (req, res) => {
    try {
        const { password } = req.body
        const { reset_token } = req.params

        if (!password) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Password required')
                .setPayload({
                    detail: 'Password required'
                })
                .build()
            return res.json(response)
        }

        if (!reset_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Invalid token')
                .setPayload({
                    detail: 'Token verification failed'
                })
                .build()
            return res.json(response)
        }
        const decoded = jwt.verify(reset_token, ENVIROMENT.JWT_SECRET)

        console.log('decoded: ', decoded);

        if (!decoded) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Invalid token')
                .setPayload({
                    detail: 'Token verification failed'
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
                .setMessage('User not found!')
                .setPayload({
                    detail: 'Invalid User'
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
            .setMessage('Success!')
            .setPayload({
                detail: 'Password updated'
            })
            .build()
        return res.status(200).json(response)

    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.json(response)
    }
} */
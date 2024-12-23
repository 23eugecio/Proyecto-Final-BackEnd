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
                .setPayload({
                    detail: 'Email not valid!'
                })
                .build()
            return res.status(400).json(response)
        }
        const existentUser = await User.findOne({ email: email })

        if (existentUser) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload(
                    {
                        detail: 'Email is already registered!'
                    }
                )
                .build()
            return res.status(400).json(response)
        } 
        

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = jwt.sign({ email: email }, 
            ENVIROMENT.JWT_SECRET, 
            { expiresIn: '1d' }
        )

        const url_verification = `${ENVIROMENT.URL_FRONT}/api/auth/verify/${verificationToken}`
        await sendEmail({
            to: email,
            subject: 'Verify your email',
            html: `
            <h1>Verify your email</h1>
            <p>Click the button below to verify your email</p>
            <a 
                style="background-color: green; color: white; padding: 5px; border-radius: 5px;"
                href="${url_verification}"
            >Verify!</a>
            `
        })

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            emailVerified: false
        })
        await newUser.save()
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Created')
            .setPayload({})
            .build()

        return res.status(201).json({
            ok: true,
            status: 201,            
            message: 'User created',
            data: {
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    id: newUser._id
                }
            }
        })

    } catch (error) {
        console.error('Error to register user: ', error) 

        if (error.code === 11000) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Bad request')
                .setPayload({
                    detail: 'Email already registered'
                })
                .build()
            return res.status(404).json(response)
        }

        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Server error')
            .setPayload({
                detail: error.message,
            })
            .build()
        return res.status(500).json(response)
    }
}

export const verifyMailValidationTokenController = async (req, res) => {
    try {
        const { verification_token } = req.params
        if (!verification_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('User not Found')
                .setPayload({
                    'detail': 'Missing verification token'
                })
                .build()
            return res.status(400).json(response)
        }

        const decoded = jwt.verify(verification_token, ENVIROMENT.JWT_SECRET)

        const user = await User.findOne({ email: decoded.email })
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('User not Found')
                .setPayload({
                    'detail': 'Email not registered'
                })
                .build()
            return res.status(404).json(response)
        }
        if (user.emailVerified) {
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(200)
            .setPayload({
                'detail': 'Email already validated'
            })
            .build()
        return res.status(200).json(response)
        }

        user.emailVerified = true
        await user.save()
        const response = new ResponseBuilder()
            .setOk(true)
            .setMessage('Success validating user')
            .setStatus(200)
            .setPayload({
                message: "Validated user"
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
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('User not found')
                .setPayload({
                    detail: 'No registered user with this email'
                })
                .build();
            return res.status(404).json(response);

        }
        if (!user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('Email no verificado')
                .setPayload(
                    {
                        detail: 'Please verify your email'
                    }
                )
                .build()
            return res.status(403).json(response)
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Invalid credentials')
                .setPayload({
                    detail: 'Incorrect password'
                })
                .build();
            return res.json(response);
        }
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
            },
            ENVIROMENT.JWT_SECRET,
            { expiresIn: '1d' }
        )
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Login successful')
            .setPayload({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            })
            .build();
        return res.status(200).json(response);
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: error.message
            })
            .build();
        return res.status(500).json(response);
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
console.log(email)
        if (!email) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Email is required')
                .setPayload({
                    detail: 'Please provide a valid email address',
                })
                .build();
            return res.status(400).json(response);
        }

        console.log('Email received for reset:', email);


        const user = await UserRepository.obtenerPorEmail(email);
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('User not found')
                .setPayload({
                    detail: 'No registered user with this email',
                })
                .build();
            return res.status(404).json(response);
        }
        const resetToken = jwt.sign({ email: user.email }, ENVIROMENT.JWT_SECRET, {
            expiresIn: '1h',
        });

        user.resetToken = resetToken;
        await UserRepository.save(user);

        const resetUrl = `${URL_FRONT}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset',
            html: `
                <div>
                    <h1>You have requested to reset your password</h1>
                    <p>Please click the link below to reset your password:</p>
                    <a href='${resetUrl}' style="color: green; text-decoration: underline;">Reset Password</a>
                </div>
            `,
        });

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Email sent successfully')
            .setPayload({
                detail: 'Email sent successfully.',
            })
            .build();
        return res.status(200).json(response);
    } 
    catch (error) {
        console.error('Error in forgotPasswordController:', error.message);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal Server Error')
            .setPayload({
                detail: error.message || 'An unexpected error occurred',
            })
            .build();
        return res.status(500).json(response);
    }
};



export const resetTokenController = async (req, res) => {
    try {
        const { password } = req.body
        const { reset_token } = req.params

        if (!password) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('New password is required')
                .setPayload({
                    detail: 'Missing new password'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!reset_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Wrong token')
                .setPayload({
                    detail: 'Reset token not found'
                })
                .build()
            return res.status(400).json(response)
        }

        const decoded = jwt.verify(reset_token, ENVIROMENT.JWT_SECRET)

        console.log('Token decodificado:', decoded);

        if (!decoded) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Wrong token')
                .setPayload({
                    detail: 'Invalid token'
                })
                .build()
            return res.status(400).json(response)
        }

        const { email } = decoded

        const user = await UserRepository.obtenerPorEmail(email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('User not found')
                .setPayload({
                    detail: 'User not found'
                })
                .build()
            return res.status(400).json(response)
        }
        const encriptedPassword = await bcrypt.hash(password, 10);
        user.password = encriptedPassword
        await user.save()

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Password reset successfully!')
            .setPayload({
                detail: 'Password reset successfully'
            })
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
        return res.status(500).json(response)
    }
}

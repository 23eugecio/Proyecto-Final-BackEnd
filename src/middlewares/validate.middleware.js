import { body, validationResult } from 'express-validator'
import ResponseBuilder from '../utils/Builders/responseBuilder.js';


export const validateEmail = [
    body('email')
        .isEmail().withMessage('Email is not valid')
]
export const validatePassword = [
    body('password')
        .isLength({ min: 8 }).withMessage('The password must be at least 8 characters long')
        .matches(/[0-9]/).withMessage(' the password must contain at least one number')
        .matches(/[A-Z]/).withMessage('The password must contain at least one uppercase letter')
        .matches(/[@$!%*?&_.-]/).withMessage('The password must contain at least one special character')
]

export const validateName = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
]

export const validateMessageContent = [
    body('content')
    .notEmpty().withMessage('The message is required')
    .isLength({min: 1}).withMessage('The message must be at least 1 character long')
]

export const handleErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setMessage('Bad request')
        .setPayload({
            errors: errors.array()
        })
        .build()
        return res.status(400).json(response)
    }
    next()
}

export const validateRegisterData = [
    ...validateName,
    ...validateEmail,
    ...validatePassword,

    handleErrors
]

export const validateLoginData = [
    ...validateEmail,
    body('password')
    .notEmpty().withMessage('Password is required'),
    handleErrors
]

export const validateForgotPasswordData = [
    ...validateEmail,
    handleErrors
]

export const validateResetPasswordData = [
    ...validatePassword,
    handleErrors
]

export const validateMessageData = [
    ...validateMessageContent,
    handleErrors
]
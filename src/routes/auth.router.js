import express from "express";
import {
    registerUserController,
    loginController,
    forgotPasswordController,
    resetTokenController,  
    verifyMailValidationTokenController
} from "../controllers/auth.controller.js";
import { verifyApiKeyMiddleware } from "../middlewares/auth.middleware.js";


const authRouter = express.Router();


authRouter.post('/register',  registerUserController);
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController);
authRouter.post('/login', loginController);
authRouter.post('/forgot-password', verifyApiKeyMiddleware, forgotPasswordController);
authRouter.put('/reset-password/:reset_token', resetTokenController);


export default authRouter






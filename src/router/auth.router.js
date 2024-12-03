import express from "express";
import { 
    forgotPasswordController,
    loginController, 
    registerUserController,  
    resetTokenController,  
    verifyMailValidationTokenController 
} from "../controllers/auth.controller.js";
import { verifyApiKeyMiddleware } from "../middlewares/auth.middleware.js";



const authRouter = express.Router();

authRouter.post('/register', verifyApiKeyMiddleware, registerUserController)
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)
authRouter.post('/login', verifyApiKeyMiddleware, loginController)
authRouter.post('/forgot-password', verifyApiKeyMiddleware, forgotPasswordController)
authRouter.put('/reset-password/:reset_token', verifyApiKeyMiddleware, resetTokenController)



export default authRouter


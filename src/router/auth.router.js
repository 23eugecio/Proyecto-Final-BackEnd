import express from "express";
import { 
    forgotPasswordController,
    loginController, 
    registerUserController,
    resetTokenController,  
    verifyMailValidationTokenController 
} from "../controllers/auth.controller.js";
import { verifyApiKeyMiddleware } from "../middlewares/auth.middleware.js";
import { validateRegisterData } from "../middlewares/validate.middleware.js";



const authRouter = express.Router();

authRouter.post('/register',  registerUserController)
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)
authRouter.post('/login', loginController)
authRouter.post('/forgot-password', verifyApiKeyMiddleware, forgotPasswordController)
authRouter.put('/reset-password/:reset_token', verifyApiKeyMiddleware, resetTokenController)
authRouter.post('/register/validate', validateRegisterData, registerUserController)
authRouter.post('/login/validate', validateRegisterData, loginController)
authRouter.post('/forgot-password/validate', validateRegisterData, forgotPasswordController)



export default authRouter


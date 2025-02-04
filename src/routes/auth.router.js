import express from 'express';
import { 
    loginController, 
    forgotPasswordController, 
    resetTokenController, 
    handleRegister, 
    verifyEmail} from '../controllers/auth.controller.js';

const authRouter = express.Router();


authRouter.post('/register', handleRegister);

authRouter.get('/verify/:token', verifyEmail);

authRouter.post('/login', loginController); 

authRouter.post('/forgot-password', forgotPasswordController);

authRouter.post('/reset-password/:reset_token', resetTokenController); 

export default authRouter;

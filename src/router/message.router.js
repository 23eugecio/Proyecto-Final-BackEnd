import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import messageController from "../controllers/message.controller.js";



const messageRouter = express.Router();
const { createMessage, getConversation } = messageController;


messageRouter.post('/send', authMiddleware, createMessage)
messageRouter.get('/conversation/:receiver_id', authMiddleware, getConversation)

export default messageRouter







import express from "express";
import { createMessage, getConversation } from "../controllers/message.controller.js";
import { authMiddleware }from "../middlewares/auth.middleware.js";


const messageRouter = express.Router();

messageRouter.post('/send', authMiddleware, createMessage)
messageRouter.get('/conversation/:receiver_id', authMiddleware, getConversation)

export default messageRouter

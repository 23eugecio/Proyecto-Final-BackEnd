import express from "express";
import { verifyTokenMiddleware } from "../middlewares/auth.middleware.js";
import { createMessage, getConversation } from "../controllers/message.controller.js";



const messageRouter = express.Router();



messageRouter.post('/send', verifyTokenMiddleware, createMessage)
messageRouter.get('/conversation/:receiver_id', verifyTokenMiddleware, getConversation)

export default messageRouter







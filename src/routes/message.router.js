import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createMessage, getConversation } from '../controllers/message.controller.js';

const messageRouter = express.Router();

// Definir rutas de mensajes
messageRouter.post('/', authMiddleware, createMessage);
messageRouter.get('/:receiver_id', authMiddleware, getConversation);

export default messageRouter;

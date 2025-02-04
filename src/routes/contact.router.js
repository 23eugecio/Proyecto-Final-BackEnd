// contact.routes.js
import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getContacts, addContact } from '../controllers/contact.controller.js';

const contactRouter = express.Router();

contactRouter.get('/', authMiddleware, getContacts);
contactRouter.post('/add', authMiddleware, addContact);

export default contactRouter;

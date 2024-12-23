import express from "express";
import { addContact, getContacts } from "../controllers/contact.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const contactRouter = express.Router();

contactRouter.post('/add', authMiddleware, addContact)
contactRouter.get('/contactService', authMiddleware, getContacts)

export default contactRouter



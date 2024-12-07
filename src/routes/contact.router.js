import express from "express";
import { verifyApiKeyMiddleware } from "../middlewares/auth.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    createContactController,
    deleteContactController,
    getAllContactController,
    getContactByIdController,
    updateContactController
} from "../controllers/contact.controller.js";


const contactRouter = express.Router()

contactRouter.use(verifyApiKeyMiddleware)
contactRouter.use(authMiddleware)
contactRouter.use(express.json())



contactRouter.get('/', authMiddleware(), getAllContactController)
contactRouter.get("/:contact_id", authMiddleware(), getContactByIdController)
contactRouter.post('/', authMiddleware(['user']), createContactController)
contactRouter.put('/:contact_id', authMiddleware(['user']), updateContactController)
contactRouter.delete('/:contact_id', authMiddleware(['user']), deleteContactController)



export default contactRouter
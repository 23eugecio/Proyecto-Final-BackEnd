import express from "express";
import { verifyApiKeyMiddleware, verifyTokenMiddleware } from "../middlewares/auth.middleware.js";
import { createContactController, deleteContactController, getAllContactController, getContactByIdController, updateContactController } from "../controllers/contact.controller.js";


const contactRouter = express.Router()

contactRouter.use(verifyApiKeyMiddleware)



contactRouter.get('/', verifyTokenMiddleware(), getAllContactController)
contactRouter.get("/:contact_id", verifyTokenMiddleware(), getContactByIdController)
contactRouter.post('/', verifyTokenMiddleware(['user']), createContactController)
contactRouter.put('/:contact_id', verifyTokenMiddleware(['user']), updateContactController)
contactRouter.delete('/:contact_id', verifyTokenMiddleware(['user']), deleteContactController)

export default contactRouter
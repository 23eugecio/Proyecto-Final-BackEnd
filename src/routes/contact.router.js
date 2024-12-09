import express from "express";
import { verifyApikeyMiddleware, verifyTokenMiddleware } from "../middlewares/auth.middleware.js";
import { getContacts, addContact, updateContact, deleteContact } from "../controllers/contact.controller.js";
import { validateContactId } from "../middlewares/validate.contact.js";

const contactRouter = express.Router();


contactRouter.use(verifyTokenMiddleware, verifyApikeyMiddleware); 


contactRouter.get("/", getContacts);


contactRouter.post("/", verifyTokenMiddleware(['user']), addContact); 


contactRouter.get("/:contact_id", verifyTokenMiddleware(), validateContactId, getContacts); 


contactRouter.put("/:contact_id", verifyTokenMiddleware(['user']), validateContactId, updateContact); 


contactRouter.delete("/:contact_id", verifyTokenMiddleware(['user']),validateContactId, deleteContact); 


export default contactRouter;



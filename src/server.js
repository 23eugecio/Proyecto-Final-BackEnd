import ENVIROMENT from "./config/enviroment.config.js";
import express from "express";
import statusRouter from "./router/status.router.js";
import configdDb from "./db/config.js";  
import authRouter from "./router/auth.router.js";
import cors from 'cors'
import contactRouter from "./router/contact.router.js";
import ContactRepository from "./repositories/contact.repository.js";
import { verifyApiKeyMiddleware } from "./middlewares/auth.middleware.js";
import messageRouter from "./router/message.router.js";



const app = express();
const PORT = ENVIROMENT.PORT


app.use(cors())
app.use(express.json())
app.use(verifyApiKeyMiddleware)

app.use('/api/status', statusRouter);
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/messages', messageRouter);

ContactRepository.createContact({name: 'prueba', email: 'prueba', message: 'prueba'})



app.listen(PORT, () => {
    console.log(`El servidor se esta escuchando en http://localhost:${PORT}`)
})
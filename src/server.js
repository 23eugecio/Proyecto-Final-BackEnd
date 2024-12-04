import ENVIROMENT from "./config/enviroment.config.js";
import express from "express";
import configdDb from "./db/config.js";  
import authRouter from "./router/auth.router.js";
import cors from 'cors'
import contactRouter from "./router/contact.router.js";
import { authMiddleware, verifyApiKeyMiddleware } from "./middlewares/auth.middleware.js";
import messageRouter from "./router/message.router.js";
import statusRouter from "./router/status.router.js";

const app = express();

app.use(cors())
app.use(express.json())

app.use(verifyApiKeyMiddleware)
app.use(authMiddleware)

app.use('/api/status', statusRouter);
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/messages', messageRouter);




app.listen(ENVIROMENT.PORT, () => {
    console.log(`server running on port ${ENVIROMENT.PORT}`)
})
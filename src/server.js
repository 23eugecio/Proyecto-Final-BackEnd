import ENVIROMENT from "./config/enviroment.config.js";
import express from "express";
import configdDb from "./db/config.js";  
import authRouter from "./router/auth.router.js";
import cors from 'cors'
import { authMiddleware, verifyApiKeyMiddleware } from "./middlewares/auth.middleware.js";
import contactRouter from "./router/contact.router.js";
import messageRouter from "./router/message.router.js";
import statusRouter from "./router/status.router.js";
import mongoose from "./db/config.js";


const app = express();

app.use(cors())
app.use(express.json())

app.use(verifyApiKeyMiddleware)
app.use(authMiddleware)

app.use('/api/status', statusRouter);
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/messages', messageRouter);



const PORT = process.env.PORT || 3000
mongoose.connect(ENVIROMENT.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB!');
    app.listen(ENVIROMENT.PORT, () => {
        console.log(`server running on port ${ENVIROMENT.PORT}`)});
    })
    .catch(error => console.error('Connection failed', error));



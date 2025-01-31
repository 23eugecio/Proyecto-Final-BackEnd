
import express from 'express'
import ENVIROMENT from './config/enviroment.config.js'
import configDb from "./db/config.js";
import cors from 'cors'
import authRouter from './routes/auth.router.js'
import messageRouter from './routes/message.router.js'
import contactRouter from './routes/contact.router.js'
import statusRouter from './routes/status.router.js';
import { verifyApiKeyMiddleware } from './middlewares/auth.middleware.js';

const app = express();

const corsOptions = {
    origin: "http://localhost:5173", 
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)

app.use(verifyApiKeyMiddleware)

app.use('/api/status', statusRouter)

app.use('/api/contacts', contactRouter)
app.use('/api/message', messageRouter)




app.listen(ENVIROMENT.PORT, () => {
    console.log(`Server is running on port ${ENVIROMENT.PORT}`)
})


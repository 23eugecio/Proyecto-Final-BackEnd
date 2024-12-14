
import express from 'express'
import ENVIROMENT from './config/enviroment.config.js'
import configDb from "./db/config.js";
import cors from 'cors'
import authRouter from './routes/auth.router.js'
import messagesRouter from './routes/message.router.js'
import contactRouter from './routes/contact.router.js'
import statusRouter from './routes/status.router.js';
import { verifyApiKeyMiddleware } from './middlewares/auth.middleware.js';

const app = express()


const corsOptions = {
    origin: [
        'http://localhost:5173',  
        ENVIROMENT.URL_FRONT     
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.options('*', cors(corsOptions))

app.use(verifyApiKeyMiddleware)

app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/contacts', contactRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

export default app



app.listen(ENVIROMENT.PORT, () => {
    console.log(`Server is running on port ${ENVIROMENT.PORT}`)
})
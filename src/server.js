import express from 'express'
import ENVIROMENT from './config/enviroment.config.js'
import configdDb from "./db/config.js";
import cors from 'cors'
import authRouter from './routes/auth.router.js'
import messagesRouter from './routes/message.router.js'
import contactRouter from './routes/contact.router.js'
const app = express()

app.use(cors())
app.use(express.json())


app.get('/api/status/ping', (req, res) => {
    res.status(200).json({
        ok:true,
        status: 200,
        message: 'pong'
    })
})


app.use('/api/auth', authRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/contacts', contactRouter)



app.listen(ENVIROMENT.PORT, () =>{
    console.log(`Server is running on port ${ENVIROMENT.PORT}`)
})




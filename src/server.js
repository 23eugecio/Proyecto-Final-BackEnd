import ENVIROMENT from "./config/enviroment.config.js";
import express from "express";
import statusRouter from "./router/status.router.js";
import configdDb from "./db/config.js";  
import authRouter from "./router/auth.router.js";
import transporter from "./config/transporter.config.js";
import cors from 'cors'
import { verifyTokenMiddleware } from "./middlewares/auth.middleware.js";



const app = express();
const PORT = ENVIROMENT.PORT


app.use(cors())
app.use(express.json())
app.use(verifyTokenMiddleware)

app.use('/api/status', statusRouter);
app.use('/api/auth', authRouter)



app.listen(PORT, () => {
    console.log(`El servidor se esta escuchando en http://localhost:${PORT}`)
})
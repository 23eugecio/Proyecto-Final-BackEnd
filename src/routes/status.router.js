import express from "express";
import { getPingController } from "../controllers/status.controller.js";
import { verifyTokenMiddleware, verifyApiKeyMiddleware } from "../middlewares/auth.middleware.js";



const statusRouter = express.Router()


statusRouter.get('/ping', getPingController)
statusRouter.get('/protected-route/ping', verifyTokenMiddleware(), getPingController)




export default statusRouter
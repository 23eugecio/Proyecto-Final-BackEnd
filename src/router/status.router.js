import express from "express";
import { getPingController } from "../controllers/status.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";



const statusRouter = express.Router()

statusRouter.use(express.json())
statusRouter.use(authMiddleware)

statusRouter.get('/ping', getPingController)
statusRouter.get('/protected-route/ping', authMiddleware(), getPingController)
statusRouter.get('/admin/ping', authMiddleware(), getPingController)



export default statusRouter
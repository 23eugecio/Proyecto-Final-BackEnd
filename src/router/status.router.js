import express from "express";
import ResponseBuilder from "../utils/Builders/responseBuilder.js";
import { getPingController } from "../controllers/status.controller.js";
import { verifyTokenMiddleware } from "../middlewares/auth.middleware.js";



const statusRouter = express.Router()



statusRouter.get('/ping', getPingController)
statusRouter.get('/protected-route/ping', verifyTokenMiddleware, getPingController)



export default statusRouter
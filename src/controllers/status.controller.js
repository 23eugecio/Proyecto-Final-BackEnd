import ResponseBuilder from "../utils/Builders/responseBuilder.js";

export const getPingController = (req, res) => {

    try{
        console.log(req.user)
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Success')
            .setPayload({
                message: 'pong'
            })
            .build()
            res.status(200).json(response);
        }
        catch(error){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: error.message
            })
            .build()
            res.status(200).json(response);
        }
}
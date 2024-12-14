import ResponseBuilder from "../utils/builders/responseBuilder.js";



export const getPingController = (req, res) => {
    const response = new ResponseBuilder()
    try{
        response
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
            response
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
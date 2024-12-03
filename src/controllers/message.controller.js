
import Message from '../models/message.model.js';
import { MessageRepository } from '../repositories/message.repository.js';
import ResponseBuilder from '../utils/Builders/responseBuilder.js';


export const createMessageController = async (req, res) => {
    try {
        const { sender, reciber, content, image, type = 'text' } = req.body;

        if (!sender || !reciber || !content) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload({
                    'detail': "Missing required fields"
                })
                .build();
            return res.status(400).json(response);
        }

        const newMessage = new Message({
            sender,
            reciber,  
            content,
            image,
            type, 
            timestamp: new Date()  
        });

        await newMessage.save();

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Created')
            .setPayload({
                data: {
                    id: newMessage._id,  
                    sender: newMessage.sender,
                    reciber: newMessage.reciber,  
                    content: newMessage.content,
                    image: newMessage.image,
                    type: newMessage.type,
                    timestamp: newMessage.timestamp
                }
            })
            .build();

        return res.status(201).json(response);

    } catch (error) {
        console.error("Error saving message:", error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: "Error saving message"
            })
            .build();
        return res.status(500).json(response);
    }
};



export const getAllMessagesController = async (req, res) => {
    try {
        const messages = await MessageRepository.getAllMessages();
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Messages found')
            .setPayload({
                data: messages
            })
            .build();
        return res.json(response);
    } catch (error) {
        console.error("Error:", error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: "Error fetching messages"
            })
            .build();
        return res.status(500).json(response);
}
};


export const getMessageByIdController = async (req, res) => {
    try {    
        const { id } = req.params;          
        const message = await MessageRepository.getMessageById(id);
        if (!message) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Message not found')
                .setPayload({
                    detail: "Message not found"
                })
                .build();
            return res.status(404).json(response);
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Message found')
            .setPayload({
                data: message
            })
            .build();
        return res.json(response);
    } catch (error) {   
        console.error("Error:", error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: "Error message"
            })
            .build();
        return res.status(500).json(response);
    }
};

export const updateMessageController = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const updatedMessage = await MessageRepository.updateMessage(id, content);
        if (!updatedMessage) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Message not found')
                .setPayload({
                    detail: "Message not found"
                })
                .build();
            return res.status(404).json(response);
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Message updated')
            .setPayload({
                data: updatedMessage
            })
            .build();
        return res.json(response);
    } catch (error) {
        console.error("Error:", error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: "Error updating message"
            })
            .build();
        return res.status(500).json(response);    
    }
};

export default { createMessageController, getAllMessagesController, getMessageByIdController, updateMessageController};    

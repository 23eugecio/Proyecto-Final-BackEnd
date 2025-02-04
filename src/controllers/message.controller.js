// controllers/message.controller.js

import MessageRepository from "../repositories/message.repository.js";
import UserRepository from "../repositories/user.repository.js";

// Crear un nuevo mensaje
export const createMessage = async (req, res) => {
    try {
        const sender = req.user.id;
        const { receiver_id, content } = req.body;

        const message = await MessageRepository.createMessage({
            sender,
            receiver: receiver_id,
            content
        });

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener la conversación entre dos usuarios
export const getConversation = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { receiver_id } = req.params;

        const conversation = await MessageRepository.findMessagesBetweenUsers(user_id, receiver_id);

        return res.status(200).json({
            ok: true,
            status: 200,
            message: 'Conversation found',
            data: {
                conversation,
            },
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return res.status(500).json({
            ok: false,
            status: 500,
            message: 'Internal server error',
            detail: error.message,
        });
    }
};

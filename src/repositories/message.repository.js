import Message from "../models/message.model.js";

class MessageRepository {
    static async createMessage(message_data) {
        try {
            let new_message = new Message(message_data);
            await new_message.save();
            return new_message; 
        } catch (error) {
            throw new Error("Error creating message: " + error.message);
        }
    }

    static async findMessagesBetweenUsers(user_id_1, user_id_2) {
        return Message.find({
            $or: [
                { author: user_id_1, receiver: user_id_2 },
                { author: user_id_2, receiver: user_id_1 },
            ],
        });
    }
}

export default MessageRepository;

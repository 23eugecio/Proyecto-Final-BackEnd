import Message from '../models/message.model.js';

class MessageRepository {
    static async createMessage(messageData) {
        const message = new Message(messageData);
        return await message.save();
    }

    static async findMessagesBetweenUsers(sender, receiver) {
        return await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ timestamp: 1 });
    }
}

export default MessageRepository;
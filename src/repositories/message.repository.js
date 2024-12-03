import Message from '../models/message.model.js'
export class MessageRepository {
    static async createMessage(sender, reciber, content) {
        const message = new Message({ sender, reciber, content })
        await message.save()
        return message
    }   
}
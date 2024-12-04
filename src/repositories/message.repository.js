import Message from "../models/message.model.js";


class MessageRepository{
    static async createMessage(message_data){
        return Message.create(message_data)
    }
    static async findMessagesBetweenUsers(user_id_1, user_id_2){
        return Message.find(
            {
                $or: [
                    {author: user_id_1, receiver: user_id_2},
                    {author: user_id_2, receiver: user_id_1}
                ]
            }
        )
    }
}

export default MessageRepository
import mongoose from 'mongoose';


const MessageSchema = new mongoose.Schema({

    sender: {
        type: String,
        required: true
    },
    reciber: { 
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    type: {
        type: String,
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


const Message = mongoose.model('Message', MessageSchema);

export default Message





















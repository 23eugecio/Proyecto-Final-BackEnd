import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({

    phone: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Hey there! I am using WhatsApp'
    }
},
    { timestamps: true })

    const User = mongoose.model('User', UserSchema)

    export default User



























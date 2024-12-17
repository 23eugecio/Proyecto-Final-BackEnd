import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        default: ''}, // Imagen en base64 opcional
}, {
    timestamps: new Date()
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact
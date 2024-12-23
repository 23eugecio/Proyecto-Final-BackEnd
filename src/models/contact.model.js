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
    image_base_64: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    timestamps: new Date()
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact
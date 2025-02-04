import mongoose from 'mongoose';

// Definir esquema de contacto
const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contact_username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Agrega automáticamente `createdAt` y `updatedAt`
});

// Crear modelo de contacto
const Contact = mongoose.model('Contact', contactSchema);

export default Contact;

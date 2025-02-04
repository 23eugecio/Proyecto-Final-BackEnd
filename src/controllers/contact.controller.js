import Contact from '../models/contact.model.js';

// Obtener todos los contactos de un usuario
export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ userId: req.user.id });
        res.json(contacts);
    } catch (err) {
        console.error('Error obteniendo contactos:', err);
        res.status(500).json({ message: 'Server error', detail: err.message });
    }
};

// Añadir un nuevo contacto
export const addContact = async (req, res) => {
    try {
        const { contact_username, email, image } = req.body;
        const newContact = new Contact({
            userId: req.user.id,  // Asocia el contacto al usuario autenticado
            contact_username,
            email,
            image
        });
        await newContact.save();
        res.status(201).json({ message: 'Contacto añadido con éxito', payload: newContact });
    } catch (err) {
        console.error('Error añadiendo contacto:', err);
        res.status(500).json({ message: 'Server error', detail: err.message });
    }
};

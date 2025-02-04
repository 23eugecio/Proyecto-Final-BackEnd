import Contact from "../models/contact.model.js";

class ContactRepository {
    // Obtener contactos activos
    static async getContacts() {
        return Contact.find({ active: true });
    }

    // Obtener contacto por ID
    static async getContactById(id) {
        return Contact.findById(id);
    }

    // Crear un nuevo contacto
    static async createContact(contact_data) {
        const new_contact = new Contact(contact_data);
        return new_contact.save();
    }

    // Actualizar un contacto
    static async updateContact(id, new_contact_data) {
        return Contact.findByIdAndUpdate(id, new_contact_data, { new: true });
    }

    // Desactivar un contacto por ID
    static async deleteContactById(id) {
        return Contact.findByIdAndUpdate(id, { active: false }, { new: true });
    }
}   

export default ContactRepository;

import Contact from "../models/message.model.js";

export class ContactRepository {

    static async getContact() {
        return Contact.find({active: true})
    }

    static async getContactById(id) {
        return Contact.findById(id)
    }

    static async createContact(contact_data) {
        const new_contact = new Contact(contact_data)
        return new_contact.save()
    }

    static async updateMessage(id, new_message_data){
        return Contact.findByIdAndUpdate(id, new_message_data, {new: true})
    }

    static async deleteContactById(id){
        return Contact.findByIdAndUpdate(id, {active: false}, {new: true})
    }
}   

export default ContactRepository;









































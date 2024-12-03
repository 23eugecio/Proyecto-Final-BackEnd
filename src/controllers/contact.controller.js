
import ContactRepository from '../repositories/contact.repository.js'
import ResponseBuilder from '../utils/Builders/responseBuilder.js'



export const getAllContactController = async (req, res) => {
    try {
        const contacts = await ContactRepository.getContact()
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contacts found')
            .setPayload({
                contacts: contacts
            })
            .build()
        return res.json(response)
    }
    catch (error) {
        console.error('Error withcontacts:', error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}


export const getContactByIdController = async (req, res) => {
    try{
        const { contact_id } = req.params
        const contact_found = await ContactRepository.getContactById(contact_id)
        if(!contact_found){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Contact not found')
            .setPayload({
                detail: `Contact with id ${contact_id} not found`
            })
            .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Contacts found')
        .setPayload({
            contact: contact_found
        })
        .build()
    return res.json(response)
    }
    catch(error){
        console.error('Error fetching contact by ID:', error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}


export const createContactController = async (req, res) => {
    try {
        const contactData = req.body;

        if (!contactData || Object.keys(contactData).length === 0) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Invalid contact data')
                .setPayload({
                    detail: 'Contact data is required'
                })
                .build()
            return res.status(400).json(response)
        }

        const newContact = await ContactRepository.createContact(contactData);

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Contact created successfully')
            .setPayload({
                contact: newContact
            })
            .build()
        return res.status(201).json(response)
}
catch (error) {
    console.error('Error creating contact:', error);
    const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Error creating contact')
        .setPayload({
            detail: error.message
        })
        .build()
    return res.status(500).json(response)
}
}



export const updateContactController = async (req, res) => {
    try {
        const { contact_id } = req.params;
        const updateData = req.body;
        if (!contact_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Invalid contact ID')
                .setPayload({
                    detail: 'Contact ID is required'
                })
                .build()
            return res.status(400).json(response)
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Invalid update data')
                .setPayload({
                    detail: 'Update data is required'
                })
                .build()
            return res.status(400).json(response)
        }

        const updatedContact = await ContactRepository.updateContact(contact_id, updateData);

        if (!updatedContact) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Contact not found')
                .setPayload({
                    detail: `Contact with id ${contact_id} not found`
                })
                .build()
            return res.status(404).json(response)
        }

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contact updated successfully')
            .setPayload({
                contact: updatedContact
            })
            .build()
        return res.json(response)
    }
    catch (error) {
        console.error('Error updating contact:', error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}


export const deleteContactController = async (req, res) => {
    try {
        const { contact_id } = req.params;

        if (!contact_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Invalid contact ID')
                .setPayload({
                    detail: 'Contact ID is required'
                })
                .build()
            return res.status(400).json(response)
        }

        const deletionResult = await ContactRepository.deleteContact(contact_id);

        if (!deletionResult) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Contact not found')
                .setPayload({
                    detail: `Contact with id ${contact_id} not found`
                })
                .build()
            return res.status(404).json(response)
        }

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contact deleted successfully')
            .build()
        return res.json(response)
    }
    catch (error) {
        console.error('Error deleting contact:', error);
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}
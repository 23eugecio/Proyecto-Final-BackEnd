import ResponseBuilder from '../utils/Builders/responseBuilder.js'
import UserRepository from "../repositories/user.repository.js";

export const addContact = async (req, res) => {
    try {
        const user_id = req.user.id
        const { contact_username } = req.body
        const user_found = await UserRepository.findUserByUsername(contact_username)

        if (!user_found) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('User not found')
                .setPayload({
                    detail: 'User not found'
                })
                .build()
            return res.status(404).json(response)
        }

        if (user_found._id === user_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('You cannot add yourself as a contact')
                .setPayload({
                    detail: 'You cannot add yourself as a contact'
                })
                .build()
            return res.status(400).json(response)
        }

        const user = await UserRepository.findById(user_id)
        if (user.contacts.includes(user_found._id)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Contact already added')
                .setPayload({
                    detail: 'Contact already added'
                })
                .build()
            return res.status(400).json(response)
        }

        await UserRepository.addContact(user_id, user_found._id)

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contact added successfully')
            .setPayload({
                detail: 'Contact added successfully'
            })
            .build()
        return res.status(200).json(response)

    } catch (error) {
        console.error(error)
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

export const getContacts = async (req, res) => {
    try {
        const user_id = req.user.id
        const user = await UserRepository.findContacts(user_id)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('User not found')
                .setPayload({
                    detail: 'User not found'
                })
                .build()
            return res.status(404).json(response)
        }
        if (!user.contacts || user.contacts.length === 0 || user.contacts.length === 0) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Contacts not found')
                .setPayload({
                    detail: 'Contacts not found'
                })
                .build()
            return res.status(404).json(response)
        }
        user.contacts = user.contacts
            .map(contact => {
                return UserRepository.findById(contact)
                    .then(user => {
                        return (
                            {
                                _id: user._id,
                                username: user.username
                            }
                        )
                    })
            })
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contacts found')
            .setPayload({
                contacts: user.contacts
            })
            .build()
        return res.status(200).json(response)

    } catch (error) {
        console.error(error)
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

export const updateContact = async (req, res) => {
    try{
        const user_id = req.user.id
        const { contact_id } = req.params
        const user = await UserRepository.findContacts(user_id)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('User not found')
                .setPayload({
                    detail: 'User not found'
                })
                .build()
            return res.status(404).json(response)
        }
        if (!user.contacts || user.contacts.length === 0 || user.contacts.length === 0) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Contacts not found')
                .setPayload({
                    detail: 'Contacts not found'
                })
                .build()
            return res.status(404).json(response)
        }    
        if (user.contacts.includes(contact_id)) {
            await UserRepository.removeContact(user_id, contact_id)
            const response = new ResponseBuilder()
                .setOk(true)
                .setStatus(200)
                .setMessage('Contact removed successfully')
                .setPayload({
                    detail: 'Contact removed successfully'
                })
                .build()
            return res.status(200).json(response)
        } else {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Contact not found')
                .setPayload({
                    detail: 'Contact not found'
                })
                .build()
            return res.status(404).json(response)
        }
        }
        catch(error){
            console.error(error)
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

export const deleteContact = async (req, res) => {
        try{
            const user_id = req.user.id
            const { contact_id } = req.params
            const user = await UserRepository.findContacts(user_id)
            if (!user) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setStatus(404)
                    .setMessage('User not found')
                    .setPayload({
                        detail: 'User not found'
                    })
                    .build()
                return res.status(404).json(response)
            }
            if (!user.contacts || user.contacts.length === 0 || user.contacts.length === 0) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setStatus(404)
                    .setMessage('Contacts not found')
                    .setPayload({
                        detail: 'Contacts not found'
                    })
                    .build()                
                return res.status(404).json(response)
            }
                    }
                    catch(error){
                        console.error(error)
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

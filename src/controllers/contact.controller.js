
import UserRepository from "../repositories/user.repository.js";

const addContact = async (req, res) => {
    try{
        const user_id = req.user.id
        const {contact_username} = req.body

        const user_found = await UserRepository.findUserByUsername(contact_username)

        if(!user_found){
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'User not found'
            })
        }
        const user = await UserRepository.findUserById(user_id)
        if(user.contacts.includes(user_found._id)){
            return res.status(400).json({
                ok: false,
                status: 400,
                message: 'User already in contacts'
            })
        }
        await UserRepository.addContact(user_id, user_found._id)

        return res.status(200).json({
            ok: true,
            status: 200,
            message: 'Contact added successfully'
        })

    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            ok: false,
            status: 500,
            message: 'Internal server error'
        })
    }
}

const getContacts = async (req, res) => {
    try{
        const user_id = req.user.id
        
        const user = await UserRepository.findContacts(user_id)
        if(!user){
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'User not found'
            })
        }

        return res.status(200).json({
            ok: true,
            status: 200,
            message: 'Contacts found',
            data: {
                contacts: user.contacts
            }
        })  
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            ok: false,
            status: 500,
            message: 'Internal server error'
        })
    }
}

export {addContact, getContacts}
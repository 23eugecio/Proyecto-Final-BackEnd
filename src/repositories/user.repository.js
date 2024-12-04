import User from "../models/user.model.js";

class UserRepository {
    static async createUser(user_data) {
        return User.create(user_data)
    }
    static async addContact(user_id, contact_id){
        return User.findByIdAndUpdate(user_id, {
            $push:{
                contacts: contact_id
            }
        })
    }
    static async findUserById (user_id){
        return User.findById(user_id)
    }

    static async findUserByUsername (username){
        return User.findOne({username: username})
    }

    static async findContacts(user_id){
        return User.findById(user_id).populate('contacts', 'username')
    }

    static async setEmailVerified(value, user_id) {
        try {
            const user = await UserRepository.obtenerPorId(user_id);
            if (!user) {
                throw new Error("User not found");
            }
            user.emailVerified = value;
            return await UserRepository.guardarUsuario(user);
        } catch (error) {
            console.error("Error setting email verified:", error);
            throw error;
        }
    }
}

export default UserRepository;

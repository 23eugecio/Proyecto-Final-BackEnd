import User from "../models/user.model.js";

class UserRepository {

    static async createUser(user_data) {
        try {
            const user = await User.create(user_data);
            return user;
        } catch (error) {
            throw new Error("Error creating user: " + error.message);
        }
    }


    static async findByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw new Error("Error finding user by email: " + error.message);
        }
    }


    static async addContact(user_id, contact_id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                user_id,
                {
                    $push: { contacts: contact_id }
                },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            throw new Error("Error adding contact: " + error.message);
        }
    }


    static async findUserById(user_id) {
        try {
            const user = await User.findById(user_id);
            return user;
        } catch (error) {
            throw new Error("Error finding user by ID: " + error.message);
        }
    }


    static async findUserByUsername(name) {
        try {
            const user = await User.findOne({ name: name });
            return user;
        } catch (error) {
            throw new Error("Error finding user by username: " + error.message);
        }
    }


    static async findContacts(user_id) {
        try {
            const user = await User.findById(user_id).populate('contacts', 'username');
            return user ? user.contacts : [];
        } catch (error) {
            throw new Error("Error finding user contacts: " + error.message);
        }
    
    }
    static async setEmailVerified(value, user_id) {
        try {
            const user = await UserRepository.findUserById(user_id);
            
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
    
            user.emailVerified = value;
            await UserRepository.save(user);
    
            return user;
        } catch (error) {
            console.error('Error al actualizar verificación de email:', error);

            if (error instanceof Error) {
                throw new Error(`No se pudo actualizar la verificación de email: ${error.message}`);
            }
    
            throw error;
        }
    }
}

export default UserRepository;


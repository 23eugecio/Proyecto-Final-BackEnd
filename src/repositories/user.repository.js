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


    static async findUserByUsername(username) {
        try {
            const user = await User.findOne({ username });
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
            const user = await User.findByIdAndUpdate(
                user_id,
                { emailVerified: value },
                { new: true }  
            );
            return user;
        } catch (error) {
            throw new Error("Error updating email verification: " + error.message);
        }
    }
}

export default UserRepository;


import User from "../models/user.model.js"

class UserRepository {

    static async obtenerPorId(id) {
        try {
            const user = await User.findOne({ _id: id });
            return user;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    }


    static async obtenerPorEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw error;
        }
    }


    static async guardarUsuario(user) {
        try {
            return await user.save();
        } catch (error) {
            console.error("Error saving user:", error);
            throw error;
        }
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

import User from "../models/user.model.js";

class UserRepository{
    static async obtenerPorId(id){
        const user = await User.findOne({_id: id})
        return user
    }
    static async obtenerPorEmail(email){
        const user = await User.findOne({email})
        return user
    }
    static async guardarUsuario (user){
        return await user.save()
    }

    static async setEmailVerified(value, user_id){
        const user = await UserRepository.obtenerPorId(user_id)
        user.emailVerified = value
        return await UserRepository.guardarUsuario()
    }
}

export default UserRepository
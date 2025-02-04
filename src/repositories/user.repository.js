import User from '../models/user.model.js';

class UserRepository {
    static async addContact(user_id, contact_id) {
        return await User.findByIdAndUpdate(
            user_id, 
            { 
                $addToSet: { contacts: contact_id } 
            }, 
            { new: true }
        );
    }
}

export default UserRepository;
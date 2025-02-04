import mongoose from 'mongoose';
const { Schema } = mongoose;


const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);
export default User;




























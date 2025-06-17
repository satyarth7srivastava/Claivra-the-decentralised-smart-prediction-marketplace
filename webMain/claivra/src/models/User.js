import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    fullName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, default: ' ' },
    role: { type: String, required: false, default: 'Buyer' },
    isConnected: { type: Boolean, required: false, default: false },
    walletID: { type: String, default: '' },
    tickets: { type: [String], default: [] },
    loginCookie: { type: String, default: '' },
    loginCookieExpire: { type: Date, default: Date.now }
});

const User = mongoose.models.users || mongoose.model('users', UserSchema);
export default User;
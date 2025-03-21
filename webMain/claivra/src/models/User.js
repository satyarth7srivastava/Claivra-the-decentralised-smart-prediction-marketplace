import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'buyer' },
    isConnected: { type: Boolean, required: true, default: false },
    walletID: { type: String },
    tickets: { type: [String], default: [] },
    loginCookie: { type: String, default: '' },
    loginCookieExpire: { type: Date, default: Date.now }
});

// UserSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

const User = mongoose.models.users || mongoose.model('users', UserSchema);
export default User;
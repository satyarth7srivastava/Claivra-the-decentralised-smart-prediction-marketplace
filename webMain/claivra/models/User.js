import exp from 'constants';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'buyer'
    },
    isConnected: {
        type: Boolean,
        required: true,
        default: false
    },
    walletID: {
        type: String,
    },
    tickets: {
        type: [String],
        default: []
    },
    loginCookie: {
        type: String,
        default: ''
    },
    loginCookieExpire: {
        type: Date,
        default: Date.now()
    }
})


const User = mongoose.models.users || mongoose.model('users', UserSchema);
export default User;
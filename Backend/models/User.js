const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    role: {
        type: String,
        required: true,
        default: 'USER'
    },
    image: {
        type: String,
        default: 'user.png'
    },
    points: {
        type: Number,
        default: 0
    }
});

User = mongoose.model('User', UserSchema);

module.exports = User;

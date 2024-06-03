const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: false,
        unique: true
    },
    gender: {
        type: String,
        required: false
    },
    nickname: {
        type: String,
        required: false
    },
    friends: [String],
    friendRequests: [{
        username: String,
        accepted: { type: Boolean, default: false }
    }],
    cover: {
        type: String,
        required: false
    },
    pfp: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

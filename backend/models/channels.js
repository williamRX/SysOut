// channels.js
const mongoose = require('mongoose');
const channelMessageSchema = require('./channelMessage');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Make the name field unique
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [channelMessageSchema],
});

module.exports = mongoose.model('Channel', channelSchema);
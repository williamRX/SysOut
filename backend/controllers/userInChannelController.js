// controllers/usersInChannelController.js
const Channel = require('../models/channels');
const User = require('../models/user');

exports.usersInChannel = async (req, res) => {
  try {
    const { channelName } = req.params;

    // Find the channel with the given name and populate the users
    const channel = await Channel.findOne({ name: channelName }).populate('users');
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found.' });
    }

    // Return the users array of the channel
    res.status(200).json({ users: channel.users });
  } catch (error) {
    console.error('Error getting users from channel:', error);
    res.status(500).json({ message: 'Error getting users from channel' });
  }
};
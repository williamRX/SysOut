// controllers/removeSomeoneFromChannelController.js
const Channel = require('../models/channels');

exports.removeSomeoneFromChannel = async (req, res) => {
  try {
    const userId = req.auth.userId; // Get the userId from the auth middleware
    const { name } = req.body;

    // Find the channel with the given name
    const channel = await Channel.findOne({ name });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found.' });
    }

    // Remove the userId from the users array of the channel
    const index = channel.users.indexOf(userId);
    if (index > -1) {
      channel.users.splice(index, 1);
      await channel.save();
      res.status(200).json({ message: 'User removed from channel successfully', channel });
    } else {
      res.status(404).json({ message: 'User not found in channel.' });
    }
  } catch (error) {
    console.error('Error removing user from channel:', error);
    res.status(500).json({ message: 'Error removing user from channel' });
  }
};
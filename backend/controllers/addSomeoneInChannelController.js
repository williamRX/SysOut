// controllers/addSomeoneInChannelController.js
const Channel = require('../models/channels');

exports.addSomeoneInChannel = async (req, res) => {
  try {
    const userId = req.auth.userId; // Get the userId from the auth middleware
    const { name } = req.body;

    // Find the channel with the given name
    const channel = await Channel.findOne({ name });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found.' });
    }

    // Add the userId to the users array of the channel
    channel.users.push(userId);
    await channel.save();

    res.status(200).json({ message: 'User added to channel successfully', channel });
  } catch (error) {
    console.error('Error adding user to channel:', error);
    res.status(500).json({ message: 'Error adding user to channel' });
  }
};
// controllers/createChannelController.js
const Channel = require('../models/channels');

exports.createChannel = async (req, res) => {
  try {
    const userId = req.auth.userId; // Get the userId from the auth middleware
    const { name } = req.body;

    // Check if a channel with the same name already exists
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(400).json({ message: 'A channel with this name already exists.' });
    }

    const channel = new Channel({ 
      name,
      users: [userId], // Add the userId to the users array
    });
    await channel.save();

    res.status(200).json({ message: 'Channel created successfully', channel });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ message: 'Error creating channel' });
  }
};
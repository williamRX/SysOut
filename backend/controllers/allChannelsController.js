// allChannelsController.js
const Channel = require('../models/channels.js');

exports.getAllChannels = async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log("USER HERE: "+ userId);
    const channels = await Channel.find({ users: { $in: [userId] } });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
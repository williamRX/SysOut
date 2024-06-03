// getChannelMessagesController.js
const Channel = require('../models/channels');

exports.getChannelMessages = async (req, res) => {
  try {
    const channelName = req.params.channelName;
    const channel = await Channel.findOne({ name: channelName });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const channelId = channel._id;
    const channelWithMessages = await Channel.findById(channelId).populate({
      path: 'messages',
      populate: {
        path: 'author',
        model: 'User' // replace 'User' with your User model name if it's different
      }
    });
    res.status(200).json(channelWithMessages.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting channel messages' });
  }
};
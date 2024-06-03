// markMessagesAsReadController.js
const Message = require('../models/message');

exports.markMessagesAsRead = async (req, res) => {
  try {
    // Log req.auth.userId and req.params.otherUserId
    console.log('req.auth.userId:', req.auth.userId);
    console.log('req.params.otherUserId:', req.params.otherUserId);

    await Message.updateMany(
      { to: req.auth.userId, from: req.params.otherUserId },
      { $set: { read: true } }
    );

    // Retrieve the messages after the update
    const messages = await Message.find({ to: req.auth.userId, from: req.params.otherUserId });

    // Log the messages to the console
    console.log(messages);

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error marking messages as read' });
  }
};
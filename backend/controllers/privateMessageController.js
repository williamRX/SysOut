const MessageModel = require('../models/message');

exports.getMessagesBetweenUsers = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { recipientUserId } = req.params;

        const messages = await MessageModel.find({
            $or: [
                { from: userId, to: recipientUserId },
                { from: recipientUserId, to: userId }
            ]
        }).sort({ timestamp: 1 })
        .populate('from to', 'username');

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
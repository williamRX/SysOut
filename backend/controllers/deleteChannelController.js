// controllers/deleteChannelController.js
const Channel = require('../models/channels');

exports.deleteChannel = async (req, res) => {
    try {
        const { name } = req.body; // Get the channel name from the request body
        console.log("Body", req.body);
        console.log("Query", req.query);
        // Check if the channel exists
        console.log('Channel Name:', name); // Log the channel name
        const existingChannel = await Channel.findOne({ name });
        console.log('Existing Channel:', existingChannel); // Log the existingChannel variable

        if (!existingChannel) {
            return res.status(404).json({ message: 'Channel not found.' });
        }

        // Delete the channel
        await Channel.findOneAndDelete({ name });

        res.status(200).json({ message: 'Channel deleted successfully' });
    } catch (error) {
        console.error('Error deleting channel:', error);
        res.status(500).json({ message: 'Error deleting channel' });
    }
};
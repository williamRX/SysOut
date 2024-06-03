const Channel = require('../models/channels.js');

exports.listAllChannels = async (req, res) => {
    try {
        const query = req.query.name ? { name: new RegExp(req.query.name, 'i') } : {};
        const channels = await Channel.find(query).select('name'); // Only select the name field
        const channelNames = channels.map(channel => channel.name);
        res.status(200).json(channelNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
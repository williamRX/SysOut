const socketIo = require('socket.io');
const Channel = require('../models/channels');

module.exports = function(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.listen(8081); // Listen on a different port

  let channels = {};

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('channelJoined', async (channelName, userId) => {
      // Find the channel by its name
      const channel = await Channel.findOne({ name: channelName });
      if (!channel) {
        console.error('No channel found with name:', channelName);
        return;
      }

      const channelId = channel._id.toString();

      if (!channels[channelId]) {
        channels[channelId] = {};
      }
      channels[channelId][userId] = socket.id;
      console.log(`User ${userId} joined channel ${channelId}, Socket ID: ${socket.id}`);
    });

    socket.on('channelMessage', async ({ content, channelName, from }) => {
      // Find the channel by its name
      const channel = await Channel.findOne({ name: channelName });
      if (!channel) {
        console.error('No channel found with name:', channelName);
        return;
      }

      const channelId = channel._id.toString();

      // Save the message to the database
      try {
        channel.messages.push({ content, author: from }); // Include the author field
        await channel.save();
      } catch (error) {
        console.error('Error saving message:', error);
      }

      console.log(`Message from user ${from} in channel ${channelId}: ${content}`);

      // Emit the message to all users in the channel
      for (let userId in channels[channelId]) {
        const socketId = channels[channelId][userId];
        io.to(socketId).emit('channelMessage', { content, from });
      }
    });
  });
};

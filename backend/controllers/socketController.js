// socketController.js
const socketIo = require('socket.io');
const Message = require('../models/message');

module.exports = function (server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.listen(8080);

  let users = {};

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('userLoggedIn', (userId) => {
      users[userId] = socket.id;
      console.log(`User logged in: ${userId}, Socket ID: ${socket.id}`);
    });

    socket.on('privateMessage', async ({ content, to, from }) => {
      const message = new Message({ content, to, from });
      try {
        await message.save();
        console.log('Author :' + message.from + ' to ' + message.to + ' : ' + message.content)
        const socketId = users[to];
        console.log('SocketId : ' + socketId)
        if (socketId) {
          io.to(socketId).emit('privateMessage', { content, from });
        }
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
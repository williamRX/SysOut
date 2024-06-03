const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const signInRouter = require('./router/signIn.js');
const loginRouter = require('./router/login.js');
const authMiddleware = require('./router/auth.js');
const lastMessagesRouter = require('./router/lastMessages.js');
const userInfoRouter = require('./router/userInfo.js');
const userUpdateRouter = require('./router/updateUserInfo.js');
const userDeleteRouter = require('./router/deleteUserInfo.js');
const userPublicInfoRouter = require('./router/userPublicInfo.js');
const http = require('http');
const server = http.createServer(app);
const setupSocketServer = require('./controllers/socketController');
const setupChannelSocketServer = require('./controllers/socketControllerChannel.js');
const getPrivateMessagesRouter = require('./router/getPrivateMessages.js');
const getAllFriendsRouter = require('./router/getAllFriend.js');
const addFriendRouter = require('./router/addFriend.js');
const deleteFriendRouter = require('./router/deleteFriend.js');
const acceptFriendRequestRouter = require('./router/acceptFriendRequest.js');
const RefuseFriendRequestRouter = require('./router/refuseFriendRequest.js');
const markMessagesAsReadRouter = require('./router/markMessagesAsRead.js');
const createChannelRouter = require('./router/createChannel.js');
const allChannelsRouter = require('./router/allChannels.js');
const addSomeoneInChannelRouter = require('./router/addSomeoneInChannel');
const signInGuestRouter = require('./router/signInGuest');
const getChannelMessageRouter = require('./router/getChannelMessages.js');
const getAllFriendRequestRouter = require('./router/getAllFriendRequest.js');
const removeSomeoneFromChannelRouter = require('./router/removeSomeoneFromChannelRouter.js');
const userInChannelRouter = require('./router/userInChannelRouter.js');
const listChannelRouter = require('./router/listChannelRouter.js');
const deleteChannelController = require('./controllers/deleteChannelController.js');

require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4m1v3ab.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connecté à MongoDB!');
});

const Message = require('./models/message');

let users = {};

setupSocketServer(server);
setupChannelSocketServer(server);

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre serveur Express !');
});

app.use('/api/signIn', signInRouter);
app.use('/api/login', loginRouter);
app.use('/api/userinfo', userInfoRouter );
app.use('/api/upduserinfo',userUpdateRouter);
app.use('/api/deluserinfo',userDeleteRouter);
app.use('/api/userPublicInfo', userPublicInfoRouter);
app.use('/api/lastMessages', lastMessagesRouter);
app.use('/api/getPrivateMessages', getPrivateMessagesRouter);
app.use('/api/getAllFriends', getAllFriendsRouter);
app.use('/api/getFriendRequest', getAllFriendRequestRouter);
app.use('/api/addFriend', addFriendRouter);
app.use('/api/deleteFriend', deleteFriendRouter);
app.use('/api/acceptFriendRequest', acceptFriendRequestRouter);
app.use('/api/refuseFriendRequest', authMiddleware, RefuseFriendRequestRouter);
app.use('/api/markMessagesAsRead', markMessagesAsReadRouter);
app.use('/api/createChannel', createChannelRouter);
app.use('/api/allChannels', allChannelsRouter);
app.use('/api/addSomeoneInChannel', addSomeoneInChannelRouter);
app.use('/api/signInGuest', signInGuestRouter);
app.use('/api/getChannelMessages', getChannelMessageRouter);
app.use('/api/removeSomeoneFromChannel', removeSomeoneFromChannelRouter);
app.use('/api/usersInChannel', userInChannelRouter);
app.use('/api/listChannel', listChannelRouter);
app.use('/api/deleteChannel', deleteChannelController.deleteChannel);

server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
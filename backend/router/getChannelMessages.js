// router/getChannelMessage.js
const express = require('express');
const router = express.Router();
const getChannelMessagesController = require('../controllers/getChannelMessagesController');
const authMiddleware = require('../controllers/auth.js');

router.get('/:channelName', authMiddleware, getChannelMessagesController.getChannelMessages);

module.exports = router;
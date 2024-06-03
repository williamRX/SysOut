// createChannel.js
const express = require('express');
const router = express.Router();
const createChannelController = require('../controllers/createChannelController.js');
const authMiddleware = require('../controllers/auth.js');

router.post('/', authMiddleware, createChannelController.createChannel);

module.exports = router;
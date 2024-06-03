// allChannels.js
const express = require('express');
const router = express.Router();
const allChannelsController = require('../controllers/allChannelsController.js');
const authMiddleware = require('../controllers/auth.js');

router.get('/', authMiddleware, allChannelsController.getAllChannels);

module.exports = router;
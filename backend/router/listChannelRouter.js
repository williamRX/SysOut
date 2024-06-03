const express = require('express');
const router = express.Router();
const listChannelController = require('../controllers/listChannelController.js');

router.get('/', listChannelController.listAllChannels);

module.exports = router;
const express = require('express');
const router = express.Router();
const { usersInChannel } = require('../controllers/userInChannelController');
const auth = require('../controllers/auth.js');

router.get('/:channelName', auth, usersInChannel);

module.exports = router;
// addSomeoneInChannel.js
const express = require('express');
const router = express.Router();
const { addSomeoneInChannel } = require('../controllers/addSomeoneInChannelController');
const auth = require('../controllers/auth.js');

router.post('/', auth, addSomeoneInChannel);

module.exports = router;
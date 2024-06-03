// removeSomeoneFromChannelRouter.js
const express = require('express');
const router = express.Router();
const { removeSomeoneFromChannel } = require('../controllers/removeSomeoneFromChannelController');
const auth = require('../controllers/auth.js');

router.post('/', auth, removeSomeoneFromChannel);

module.exports = router;
// routes/deleteChannelRouter.js
const express = require('express');
const router = express.Router();
const deleteChannelController = require('../controllers/deleteChannelController.js');

router.delete('/', deleteChannelController.deleteChannel);

module.exports = router;
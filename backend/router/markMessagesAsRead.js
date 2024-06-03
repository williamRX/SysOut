// markMessagesAsReadRouter.js
const express = require('express');
const router = express.Router();
const markMessagesAsReadController = require('../controllers/markMessagesAsRead.js')
const authMiddleware = require('../controllers/auth.js');

router.put('/:otherUserId', authMiddleware, markMessagesAsReadController.markMessagesAsRead);

module.exports = router;
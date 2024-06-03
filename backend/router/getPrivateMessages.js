const express = require('express');
const router = express.Router();
const messageController = require('../controllers/privateMessageController');
const authMiddleware = require('../controllers/auth.js');

router.get('/:recipientUserId', authMiddleware, messageController.getMessagesBetweenUsers);

module.exports = router;
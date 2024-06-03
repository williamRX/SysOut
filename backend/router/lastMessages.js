const express = require('express');
const router = express.Router();
const lastMessagesController = require('../controllers/lastMessages');
const authMiddleware = require('../controllers/auth.js');

router.get('/', authMiddleware, lastMessagesController.getLastMessages);

module.exports = router;
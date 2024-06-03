const express = require('express');
const router = express.Router();
const friend = require('../controllers/friendController.js');
const authMiddleware = require('../controllers/auth.js');

router.get('/', authMiddleware, friend.getAllFriendRequests);

module.exports = router;
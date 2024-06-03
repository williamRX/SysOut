const express = require('express');
const router = express.Router();
const acceptFriend = require('../controllers/friendController.js')
const authMiddleware = require('../controllers/auth.js');

router.post('/', authMiddleware, acceptFriend.acceptFriendRequest);

module.exports = router;
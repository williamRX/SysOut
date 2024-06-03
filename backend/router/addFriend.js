const express = require('express');
const router = express.Router();
const addFriend = require('../controllers/friendController.js')
const authMiddleware = require('../controllers/auth.js');

router.post('/', authMiddleware, addFriend.addFriend);

module.exports = router;
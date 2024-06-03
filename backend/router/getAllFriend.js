const express = require('express');
const router = express.Router();
const userDelete = require('../controllers/friendController.js')
const authMiddleware = require('../controllers/auth.js');

router.get('/', authMiddleware, userDelete.getAllFriends);

module.exports = router;
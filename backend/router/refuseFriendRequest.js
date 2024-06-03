const express = require('express');
const router = express.Router();
const refuseFriend = require('../controllers/friendController.js')
const authMiddleware = require('../controllers/auth.js');

router.post('/', authMiddleware, refuseFriend.refuseFriend);

module.exports = router;
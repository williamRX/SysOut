const express = require('express');
const router = express.Router();
const friendDelete = require('../controllers/friendController.js')
const authMiddleware = require('../controllers/auth.js');

router.delete('/', authMiddleware, friendDelete.deleteFriend);

module.exports = router;
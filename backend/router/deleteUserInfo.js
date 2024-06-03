const express = require('express');
const router = express.Router();
const userDelete = require('../controllers/UserDelete')
const authMiddleware = require('../controllers/auth.js');

router.delete('/', authMiddleware, userDelete.userDelete);

module.exports = router;
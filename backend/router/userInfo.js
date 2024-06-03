const express = require('express');
const router = express.Router();
const userController = require('../controllers/userInfo');
const authMiddleware = require('../controllers/auth.js');

router.get('/', authMiddleware , userController.userInfo);

module.exports = router;

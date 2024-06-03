const express = require('express');
const router = express.Router();
const userController = require('../controllers/userPublicInfo');
const authMiddleware = require('../controllers/auth.js');

router.get('/', authMiddleware,userController.publicUserInfo);

router.get('/:username', userController.publicUserInfo);

module.exports = router;
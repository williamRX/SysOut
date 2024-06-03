const express = require('express');
const router = express.Router();
const userUpdate= require('../controllers/updateUserInfo')
const authMiddleware = require('../controllers/auth.js');

router.post('/', authMiddleware ,userUpdate.userUpdate)

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/signIn');

router.post('/', userController.signIn);

module.exports = router;
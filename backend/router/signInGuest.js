const express = require('express');
const router = express.Router();
const guestController = require('../controllers/signInGuest');

router.post('/', guestController.signInGuest);

module.exports = router;
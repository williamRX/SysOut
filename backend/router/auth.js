const express = require('express');
const router = express.Router();
const authMiddleware = require('../controllers/auth.js');

router.get('/', authMiddleware, (req, res) => {
    console.log(req.auth.userId);
    res.send('You are authenticated!');
});

module.exports = router;
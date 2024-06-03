const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signIn = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.status(409).json({ message: 'Email already exists' });
      } else {
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            const user = new User({
              username: req.body.username,
              email: req.body.email,
              password: hash,
              phone: req.body.phone,
              gender: req.body.gender,
              pfp: req.body.picture,
              cover: req.body.cover
            });
            user.save()
              .then(() => {
                const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
                const token = jwt.sign(
                  { userId: user._id },
                  secretKey,
                  { expiresIn: '24h' }
                );
                res.status(201).json({ 
                  message: 'Utilisateur créé !',
                  userId: user._id,
                  token: token
                });
              })
              .catch(error => {
                console.error(error); // log the error
                res.status(400).json({ error: 'An error occurred while saving the user.' });
              });
          })
          .catch(error => res.status(500).json({ error: 'An error occurred while hashing the password.' }));
      }
    })
    .catch(error => res.status(500).json({ error: 'An error occurred while checking the user.' }));
};
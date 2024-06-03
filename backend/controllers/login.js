const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.login = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            console.log('User:', user); // Debug statement
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    console.log('Password Valid:', valid); // Debug statement
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
                    console.log('Clé secrète utilisée pour la vérification :', process.env.JWT_SECRET);
                    const token = jwt.sign(
                        { userId: user._id },
                        secretKey,
                        { expiresIn: '24h' }
                    );
                    console.log('Token:', token); // Log the token
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                })
                .catch(error => {
                    console.error('Password Validation Error:', error); // Log the error
                    res.status(500).json({ error: 'An error occurred while validating the password.' });
                });
        })
        .catch(error => res.status(500).json({ error: 'An error occurred while fetching the user.' }));
};
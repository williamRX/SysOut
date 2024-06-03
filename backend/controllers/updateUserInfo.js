const UserModel = require('../models/user');

exports.userUpdate = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        if (req.body.username) {
            user.username = req.body.username;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        if (req.body.phone) {
            user.phone = req.body.phone;
        }
        if (req.body.gender) {
            user.gender = req.body.gender;
        }
        if (req.body.pfp) {
            user.pfp = req.body.pfp;
        }
        if (req.body.cover) {
            user.cover = req.body.cover;
        }
        if (req.body.bio) {
            user.bio = req.body.bio;
        }

        await user.save();

        res.json({ message: 'Informations de l\'utilisateur mises à jour.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
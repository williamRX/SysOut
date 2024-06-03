const UserModel = require('../models/user');

exports.userInfo = async (req, res) => {
    try {
        const userId = req.auth.userId; // Accédez à l'ID de l'utilisateur avec req.auth.userId
        const user = await UserModel.findById(userId); // Utilisez UserModel pour trouver l'utilisateur

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
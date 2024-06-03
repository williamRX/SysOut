const UserModel = require('../models/user');

exports.publicUserInfo = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await UserModel.findOne({ username }, 'id username gender pfp cover bio'); 

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
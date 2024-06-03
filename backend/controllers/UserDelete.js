const UserModel = require('../models/user');

exports.userDelete = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        await UserModel.deleteOne({ _id: userId }); // Utilisez UserModel.deleteOne pour supprimer l'utilisateur
        res.json({ message: 'Utilisateur supprimé.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
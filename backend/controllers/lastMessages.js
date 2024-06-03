const Message = require('../models/message');
const User = require('../models/user');

exports.getLastMessages = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const messages = await Message.find({
            $or: [{ from: userId }, { to: userId }]
        })
            .sort({ timestamp: -1 }) // Triage par ordre chronologique décroissant
            .populate('from', 'username pfp') // Ajout du nom d'utilisateur et pfp de l'expéditeur
            .populate('to', 'username pfp');  // Ajout du nom d'utilisateur et pfp du destinataire

        // Stocke tous les messages dans un Map
        const lastMessagesMap = new Map();

        // Cherche le dernier message avec chaque utilisateur
        messages.forEach((message) => {
            let otherUserId;

            if (message.from && message.to) {
                otherUserId = message.from.equals(userId) ? message.to : message.from;
            } else {
                return;
            }

            // Récupère l'utilisateur courant et l'autre utilisateur
            const selfUser = message.from.equals(userId) ? message.from : message.to;
            const otherUser = message.from.equals(userId) ? message.to : message.from;

            // Vérifie si l'utilisateur courant est celui qui a fait la requête
            const isSelfUser = selfUser.equals(userId);

            // Récupère le nom d'utilisateur et pfp de l'utilisateur qui n'a pas fait la requête
            const otherUserName = isSelfUser ? otherUser.username : selfUser.username;
            const otherUserPfp = isSelfUser ? otherUser.pfp : selfUser.pfp;

            // Crée une clé unique pour chaque paire d'utilisateurs
            const key = [userId, otherUserId].sort().join('-');

            // Crée un objet avec les informations nécessaires
            const lastMessage = {
                _id: message._id,
                content: message.content,
                name: otherUserName, // Ajoute le nom de l'utilisateur qui n'a pas fait la requête
                pfp: otherUserPfp, // Ajoute le pfp de l'utilisateur qui n'a pas fait la requête
                from: message.from,
                to: message.to,
                timestamp: message.timestamp,
                __v: message.__v
            };

            if (!lastMessagesMap.has(key)) {
                lastMessagesMap.set(key, lastMessage);
            } else {
                // Si un message existe déjà pour cette paire d'utilisateurs, ne le remplace que s'il est plus récent
                const existingMessage = lastMessagesMap.get(key);
                if (new Date(message.timestamp) > new Date(existingMessage.timestamp)) {
                    lastMessagesMap.set(key, lastMessage);
                }
            }
        });

        // Transforme ce qui reste en tableau
        const lastMessages = Array.from(lastMessagesMap.values());

        res.status(200).json(lastMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signInGuest = async (req, res, next) => {
  const defaultPassword = "defaultPassword"; // Définir un mot de passe par défaut

  // Vérifiez d'abord si l'email existe déjà
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ error: "Email déjà utilisé." });
      }

      // Si l'email n'existe pas, continuez à créer l'utilisateur
      bcrypt
        .hash(defaultPassword, 10)
        .then((hash) => {
          const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash, // Utiliser le mot de passe haché
            phone: req.body.phone,
            gender: req.body.gender,
            pfp: req.body.picture,
          });

          user
            .save()
            .then(() => {
              const secret = process.env.JWT_SECRET || "defaultSecretKey";
              const token = jwt.sign(
                { userId: user._id },
                secret, // Utilisez 'secret' au lieu de 'secretKey'
                { expiresIn: "24h" } // Le token expirera après 24 heures
              );

              // Programmez la suppression de l'utilisateur après 24 heures
              setTimeout(() => {
                User.findByIdAndDelete(user._id).catch((error) =>
                  console.error("Error deleting user:", error)
                );
              }, 3 * 60 * 1000);

              res.status(201).json({
                message: "Utilisateur invité créé !",
                userId: user._id,
                token: token,
              });
            })
            .catch((error) => {
              console.error(error); // log the error
              res
                .status(400)
                .json({
                  error:
                    "Une erreur s'est produite lors de la sauvegarde de l'utilisateur.",
                });
            });
        })
        .catch((error) =>
          res
            .status(500)
            .json({
              error:
                "Une erreur s'est produite lors du hachage du mot de passe.",
            })
        );
    })
    .catch((error) =>
      res
        .status(500)
        .json({
          error:
            "Une erreur s'est produite lors de la vérification de l'email.",
        })
    );
};

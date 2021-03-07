require("dotenv").config();
const express = require("express");
const stripeRoutes = require("./stripe/routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const userManagement = require("express-user-management");
const { connect, db } = require("./utils/db");

// se connecter à notre base de données Mongo
connect();

// configurer notre serveur HTTP
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send({ status: "running" });
});

/**
 * Ajouter les routes d'API pour Stripe
 */
app.use(stripeRoutes);

/**
 * Configurer la gestion des utilisateurs
 */
(async () => {
  await userManagement.init(app, {
    mongoUrl: process.env.MONGO_URL,
    activationRequired: false,
    usersTable: "users",
    jwtSecret: process.env.JWT_SECRET || "secret",
    passwordResetAdress: process.env.BASE_URL + "/passwordReset/",
    accountActivationAdress: process.env.BASE_URL,
    apiKey: {
      table: "projects",
      documentKey: "apiKey.apiKey",
    },
    mails: {
      apiKey: process.env.SENDGRID_API_KEY,
      activation: {
        subject: "Activate your account!",
        sender: process.env.EMAIL_SENDER,
        body: `Almost done!
               Please click this link to activate your account!

               https://social-gallery.net/activate-email?{{user.activation.code.apiKey}}`,
      },
      passwordReset: {
        subject: "Password reset link",
        sender: "accounts@gwenp.fr",
        body: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
              Please click on the following link, or paste this into your browser to complete the process:
              {{passwordResetAdress}}?{{token}}
              If you did not request this, please ignore this email and your password will remain unchanged.`,
      },
    },
  });

  app.get("/userinfo", userManagement.auth.required, async (req, res) => {
    res.send({ user: req.user });
  });

  /**
   * Servir notre front-end (un build est obligatoire avant de pouvoir le servir)
   */
  app.use(express.static("front/dist"));

  app.listen(process.env.PORT, () => {
    console.log(`server app listening on port ${process.env.PORT}!`);
  });
})();

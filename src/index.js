require("dotenv").config();
const express = require("express");
const app = express();
const stripeRoutes = require("./stripe/routes");

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "5mb" }));

const userManagement = require("express-user-management");

const port = process.env.PORT || 3001;
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

  /**
   * Ajouter les routes d'API pour Stripe
   */
  app.use(stripeRoutes);

  /**
   * Serve Vue.js app (un build est obligatoire avant de pouvoir le servir)
   */
  app.use(express.static("front/dist"));

  app.get("/status", userManagement.auth.required, (req, res) => {
    console.log("req.user", req.user);
    res.send({ status: "running" });
  });
  app.listen(process.env.PORT, () => {
    console.log(`server app listening on port ${process.env.PORT}!`);
  });
})();

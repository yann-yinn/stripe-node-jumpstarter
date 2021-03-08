require("dotenv").config();
const express = require("express");
const stripeRoutes = require("./stripe/routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const userManagement = require("./utils/userManagement");
const { connect, db } = require("./utils/db");
ObjectId = require("mongodb").ObjectID;

// configurer notre serveur HTTP
const app = express();
app.use(cors());

// se connecter à notre base de données Mongo
connect();

// démarrer l'API express pour l'authentification
(async () => {
  await userManagement.init(app);
})();

app.use((req, res, next) => {
  // ne PAS utiliser le parser JSON automatiquement pour les webhooks!
  if (req.originalUrl === "/api/stripe/webhooks") {
    next();
  } else {
    bodyParser.json({ limit: "5mb" })(req, res, next);
  }
});

/**
 * Ajouter les routes d'API pour Stripe
 */
app.use(stripeRoutes);

app.get("/", (req, res) => {
  res.send({ status: "running" });
});

app.get("/userinfo", async (req, res) => {
  const user = await db()
    .collection("users")
    .findOne({ _id: ObjectId(req.user.id) });
  res.send({ user: user });
});

/**
 * Servir notre front-end (un build est obligatoire avant de pouvoir le servir)
 */
app.use(express.static("front/dist"));

app.listen(process.env.PORT, () => {
  console.log(`server app listening on port ${process.env.PORT}!`);
});

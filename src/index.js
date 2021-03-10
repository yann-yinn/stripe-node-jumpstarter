const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userManagement = require("./utils/userManagement");
const { connect } = require("./utils/db");

// configurer notre serveur HTTP
const app = express();
app.use(cors());

// utiliser JSON pour parser le corps de requêtes entrantes,
// SAUF pour les webhooks STRIPE qui sont signés.
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhooks") {
    bodyParser.raw({ type: "*/*" })(req, res, next);
  } else {
    bodyParser.json({ limit: "5mb" })(req, res, next);
  }
});

Promise.all([
  // connect to our database
  connect(),
  // démarrer l'API de gestion des utilisateurs
  userManagement.init(app),
]).then(() => {
  // ajouter nos routes stripes
  app.use(require("./stripe/routes"));

  // Servir notre front-end (un build est obligatoire avant de pouvoir le servir)
  app.use(express.static("front/dist"));

  app.listen(process.env.PORT, () => {
    console.log(`server app listening on port ${process.env.PORT}!`);
  });
});

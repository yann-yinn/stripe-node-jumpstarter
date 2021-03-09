require("dotenv").config();
const userManagement = require("./userManagement");
const { connect } = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// configurer notre serveur HTTP
const app = express();
app.use(cors());

// utiliser JSON pour parser nos corps de requêtes entrantes,
// SAUF pour les webhooks STRIPE
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhooks") {
    next();
  } else {
    bodyParser.json({ limit: "5mb" })(req, res, next);
  }
});

/**
 * Servir notre front-end (un build est obligatoire avant de pouvoir le servir)
 */
app.use(express.static("front/dist"));

module.exports = async function () {
  // add user and authentification API
  await userManagement.init(app);
  // connect to our own database
  await connect();
  return { app };
};

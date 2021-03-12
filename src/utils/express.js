const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// configurer notre serveur HTTP
const app = express();
app.use(cors());

/**
 * Toujours parser nos corps de requêtes en JSON
 * SAUF pour la route qui réceptionne les webhooks de Stripe
 */
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhooks") {
    bodyParser.raw({ type: "*/*" })(req, res, next);
  } else {
    bodyParser.json({ limit: "5mb" })(req, res, next);
  }
});

module.exports = app;

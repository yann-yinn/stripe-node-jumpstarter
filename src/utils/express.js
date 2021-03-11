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

// la démo est hébergée chez heroku,
// on sert directement notre front-end avec express:
if (process.env.NODE_ENV === "production") {
  // serve Vue.js build
  app.use(express.static("front/dist"));
  // redirect 404 to index.html for Vue.js
  app.get("*", function (req, res) {
    res.redirect("/");
  });
}

module.exports = app;

const userManagement = require("express-user-management");
const userManagementConfig = require("../config/user-management");
const { connect } = require("../utils/db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
const serveStaticApp = require("../utils/serveStaticApp");

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

/**
 * Avant d'éxécuter l'application, on se connecte à la base de données
 * et on initialise notre gestion des utilisateurs pour avoir
 * accès au middleware express d'authentification pour nos routes.
 */
async function init() {
  await Promise.all([
    connect(),
    userManagement.init(app, userManagementConfig),
  ]);
  return app;
}

/**
 * Démarrer les serveurs.
 */
function serve(app) {
  app.listen(process.env.PORT, () => {
    console.log(`✨listening on port http://localhost:${process.env.PORT}!`);
  });

  // ouvrir un tunnel local pour réceptionner les webhooks de stripe en local
  if (process.env.NODE_ENV === "development") {
    require("../utils/localtunnel")();
  }

  // servir le build du front-end en production, pour la démo hébergée sur Heroku
  if (process.env.NODE_ENV === "production") {
    serveStaticApp(app, "front/dist");
  }
}

module.exports = { init, serve };

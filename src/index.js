const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userManagement = require("express-user-management");
const initUserManagement = require("./utils/initUserManagement");
const { connect, db } = require("./utils/db");
const oid = require("mongodb").ObjectID;

// configurer notre serveur HTTP
const app = express();
app.use(cors());

// utiliser JSON pour parser le corps des requêtes entrantes,
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
  initUserManagement(app),
]).then(() => {
  // ajouter nos routes stripes
  app.use(require("./stripe/routes"));

  app.get("/api/userinfo", userManagement.auth.required, async (req, res) => {
    res.send("userinfo");
    const fullUser = await db()
      .collection("users")
      .findOne({ _id: oid(req.user.id) });
    console.log("fullUser", fullUser);
  });

  // la démo est hébergée chez heroku, express est utilisé pour servir le front-end
  if (process.env === "PRODUCTION") {
    app.use(express.static("front/dist"));
  }

  app.listen(process.env.PORT, () => {
    console.log(`server app listening on port ${process.env.PORT}!`);
  });
});

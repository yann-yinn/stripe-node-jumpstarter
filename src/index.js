const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userManagement = require("express-user-management");
const initUserManagement = require("./utils/initUserManagement");
const { connect, db } = require("./utils/db");
const oid = require("mongodb").ObjectID;
const stripeConfig = require("./stripe/config");
const stripe = require("stripe")(stripeConfig.stripeSecretKey);

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

  /**
   * Retourne toutes les infos user non sensibles.
   */
  app.get("/api/userinfo", userManagement.auth.required, async (req, res) => {
    // pull full user object from database
    const fullUser = await db()
      .collection("users")
      .findOne({ _id: oid(req.user.id) });

    // get current subscription for this user
    const subscription = await stripe.plans
      .retrieve(fullUser.stripePriceId)
      .then((plan) => {
        return stripe.products.retrieve(plan.product).then((product) => {
          plan.product = product;
          return plan;
        });
      });

    res.send({
      id: fullUser._id,
      email: fullUser.email,
      username: fullUser.username,
      subscription,
      subscriptionStatus: fullUser.subscriptionStatus,
    });
  });

  // la démo est hébergée chez heroku, express est utilisé pour servir le front-end
  if (process.env === "PRODUCTION") {
    app.use(express.static("front/dist"));
  }

  app.listen(process.env.PORT, () => {
    console.log(`server app listening on port ${process.env.PORT}!`);
  });
});

const { db } = require("../utils/db");
const oid = require("mongodb").ObjectID;
const config = require("../stripe/config");
const stripe = require("stripe")(config.stripeSecretKey);

module.exports = async (req, res) => {
  // récupérer le user complet depuis la base de données
  const fullUser = await db()
    .collection("users")
    .findOne({ _id: oid(req.user.id) });

  // récupérer depuis Stripe les données concernant l'abonnement de cet utilisateur
  let subscription = null;
  if (fullUser.stripeSubscriptionId) {
    subscription = await stripe.subscriptions.retrieve(
      fullUser.stripeSubscriptionId
    );
    // on ajoute les infos du produit associé à cet abonnement
    subscription.product = await stripe.products.retrieve(
      subscription.plan.product
    );
  }

  res.send({
    id: fullUser._id,
    email: fullUser.email,
    username: fullUser.username,
    subscription,
  });
};

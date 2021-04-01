const { db } = require("../utils/db");
const oid = require("mongodb").ObjectID;
const stripeService = require("../stripe/stripe.service");

async function userInfo(req, res) {
  // récupérer le user complet depuis la base de données
  const fullUser = await db()
    .collection("users")
    .findOne({ _id: oid(req.user.id) });

  // récupérer depuis Stripe les données concernant l'abonnement de cet utilisateur
  let subscription = null;
  if (fullUser.stripeSubscriptionId) {
    subscription = stripeService.getSubcriptionInfos(
      fullUser.stripeSubscriptionId
    );
  }

  res.send({
    id: fullUser._id,
    email: fullUser.email,
    username: fullUser.username,
    subscription,
  });
}

module.exports = {
  userInfo,
};

const config = require("../config");
const stripe = require("stripe")(config.stripeSecretKey);

module.exports = async (req, res) => {
  let customerId;

  /*==============================
   * @STRIPE_TO_COMPLETE
   *
   * Ici vous devez retrouvez depuis votre base de données locale
   * le customerId de votre utilisateur actuellement connecté,
   * pour pouvoir lui générer son lien de session vers le portail client
   *=============================*/

  // const user = getCurrentUser();
  // customerId = user.stripeCustomerId;

  /*==============================
   * @END_STRIPE_TO_COMPLETE
   *=============================*/

  if (!customerId) {
    response.status(400).send({
      error: {
        message: 'Error: "customerId" is empty.',
      },
    });
  }

  try {
    // l'url vers laquelle sera redirigée le visiteur une fois
    // qu'il a fini de gérer son abonnement
    const returnUrl = config.stripeBillingReturnUrl;

    const portalsession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    res.send({
      url: portalsession.url,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};

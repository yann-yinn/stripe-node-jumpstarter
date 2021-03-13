const config = require("../config");
const stripe = require("stripe")(config.stripeSecretKey);
const hooks = require("../hooks");

/**
 * Retourne une URL qui permet aux clients de se rendre sur son espace
 * de gestion des abonnements
 * Voir https://stripe.com/docs/billing/subscriptions/customer-portal
 */
module.exports = async (req, res) => {
  const customerId = await hooks.onCreateCustomerPortalSession({ req });

  if (!customerId) {
    res.status(400).send({
      error: {
        message: 'Error: "customerId" is empty.',
      },
    });
  } else {
    try {
      // l'url vers laquelle sera redirigée le visiteur une fois
      // qu'il a fini de gérer son abonnement, par exemple son compte.
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
  }
};

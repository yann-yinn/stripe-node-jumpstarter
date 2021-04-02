const config = require("./stripe.config");
const stripeService = require("./stripe.service");
const adapter = require("./stripe.adapter");

/**
 * Récupérer la liste des plans spécifiées dans stripe.config.js
 */
async function plans(req, res) {
  const plans = await stripeService.getPlans();
  res.send({ plans });
}

/**
 * Créer une nouvelle session Stripe: tout processus de paiement
 * commence en appelant ce endpoint.
 */
async function createCheckoutSession(req, res) {
  const { priceId } = req.body;
  if (!priceId) {
    response.status(400).send({
      error: "PriceId is required.",
    });
  }
  const session = await stripeService.createCheckoutSession({
    user: req.user,
    priceId,
  });
  res.send({
    sessionId: session.id,
  });
}

/**
 * Retourne une URL qui permet aux clients de se rendre sur son espace
 * de gestion des abonnements
 * Voir https://stripe.com/docs/billing/subscriptions/customer-portal
 */
async function createCustomerPortalSession(req, res) {
  const portalSession = await stripeService.createCustomerPortalSession({
    user: req.user,
  });
  res.send(portalSession);
}

/**
 * Stripe appelera ce controller lorsqu'un achat est terminé ou lors
 * d'autres évènements clefs concernant l'abonnement.
 *
 * C'est l'endroit idéal pour mettre à jour votre utilisateur
 * avec les infos de son abonnement (status de l'abonnement, id client Stripe)
 */
async function webhooks(req, res) {
  const signature = req.headers["stripe-signature"];
  try {
    const event = stripeService
      .getStripe()
      .webhooks.constructEvent(req.body, signature, config.stripeWebhookSecret);
    await adapter.onWehbooks({ event });
    res.sendStatus(200);
  } catch (e) {
    console.log(e); // on veut voir cette erreur dans le terminal
    res.status(500).send({
      error: e.message,
    });
  }
}

module.exports = {
  plans,
  createCheckoutSession,
  webhooks,
  createCustomerPortalSession,
};

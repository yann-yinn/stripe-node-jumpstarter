const config = require("../config");
const stripeService = require("./stripe.service");
const adapter = require("../adapter");

/**
 * Récupérer la liste des plans spécifiées dans stripe.config.js
 */
async function plans(req, res) {
  await stripeService.getPlans();
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
  const portalSession = stripeService.createCustomerPortalSession({
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
async function webhooks(request, response) {
  const signature = request.headers["stripe-signature"];
  const event = getStripe().webhooks.constructEvent(
    request.body,
    signature,
    config.stripeWebhookSecret
  );
  await adapter.onWehbooks({ event });
  response.sendStatus(200);
}

module.exports = {
  plans,
  createCheckoutSession,
  webhooks,
  createCustomerPortalSession,
};

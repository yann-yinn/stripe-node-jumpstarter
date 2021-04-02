const config = require("./stripe.config");
const stripeService = require("./stripe.service");
const adapter = require("./stripe.adapter");

/**
 * Récupérer la liste des plans spécifiées dans stripe.config.js
 */
async function plans(req, res) {
  try {
    const plans = await stripeService.getPlans();
    res.send({ plans });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
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
  try {
    const session = await stripeService.createCheckoutSession({
      user: req.user,
      priceId,
    });
    res.send({
      sessionId: session.id,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

/**
 * Retourne une URL qui permet aux clients de se rendre sur son espace
 * de gestion des abonnements
 * Voir https://stripe.com/docs/billing/subscriptions/customer-portal
 */
async function createCustomerPortalSession(req, res) {
  try {
    const portalSession = await stripeService.createCustomerPortalSession({
      user: req.user,
    });
    res.send(portalSession);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

/**
 * Stripe appelera ce controller lorsqu'un achat est terminé ou lors
 * d'autres évènements clefs.
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
    // Dire à Stripe que tout s'est bien passé.
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

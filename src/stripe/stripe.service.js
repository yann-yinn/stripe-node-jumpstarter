const config = require("./stripe.config");
const stripe = require("stripe");
const adapter = require("./stripe.adapter");

/**
 * @returns {object} - une instance configurée du client d'API stripe
 */
function stripeApi() {
  return stripe(config.stripeSecretKey);
}

/**
 * Récupérer la liste des plans tarifaires spécifiés dans stripe.config.js
 * @returns {array} - array of plans objects
 */
async function getPlans() {
  const plans = await Promise.all(
    config.prices.map((priceId) => {
      return stripeApi()
        .plans.retrieve(priceId)
        .then((plan) => {
          return stripeApi()
            .products.retrieve(plan.product)
            .then((product) => {
              plan.product = product;
              return plan;
            });
        });
    })
  );
  return plans;
}

/**
 * Commencer le processus d'achat d'un abonnement par carte bancaire
 * @param {object} options
 * @param {object} options.user
 * @param {string} options.priceId
 * @returns {Promise<object>} Promise object represents the sum of a and b
 */
async function createCheckoutSession({ user, priceId }) {
  let checkoutConfig = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    // en cas de succès du paiement, le visiteur sera redirigé à cette adresse:
    success_url: config.stripeCheckoutSuccessUrl,
    // en cas d'annulation du paiement, rediriger le visiteur à cette adresse:
    cancel_url: config.stripeCheckoutCancelUrl,
  };

  await adapter.onCreateCheckoutSession({
    user,
    checkoutConfig,
    priceId,
  });

  const session = await stripeApi().checkout.sessions.create(checkoutConfig);
  return session;
}

/**
 * Générer une url pour accéer
 * @param {object} options
 * @param {object} options.user
 * @returns {object} - portalSession
 */
async function createCustomerPortalSession({ user }) {
  // l'url vers laquelle sera redirigée le visiteur une fois
  // qu'il a fini de gérer son abonnement, par exemple son compte.
  const returnUrl = config.stripeBillingReturnUrl;
  const portalSessionConfig = {
    return_url: returnUrl,
  };

  await adapter.onCreateCustomerPortalSession({ portalSessionConfig, user });

  const portalsession = await stripeApi().billingPortal.sessions.create(
    portalSessionConfig
  );
  return portalsession;
}

/**
 * Récupérer les infos complètes d'une subscription, avec
 * les informations du produit associé.
 *
 * @param {string} subscriptionId
 * @returns {object} - subscription
 */
async function getSubcriptionInfos(subscriptionId) {
  const subscription = await stripeApi().subscriptions.retrieve(subscriptionId);
  // on ajoute les infos du produit associé à cet abonnement
  subscription.product = await stripeApi().products.retrieve(
    subscription.plan.product
  );
  return subscription;
}

/**
 *
 * @param {string} signature - webhook signature, récupérée depuis request.headers["stripe-signature"];
 */
async function handleWebhooks({ signature }) {
  const event = apiStripe().webhooks.constructEvent(
    request.body,
    signature,
    config.stripeWebhookSecret
  );
  await adapter.onWehbooks({ event });
}

module.exports = {
  stripeApi,
  getPlans,
  getSubcriptionInfos,
  createCheckoutSession,
  createCustomerPortalSession,
  handleWebhooks,
};

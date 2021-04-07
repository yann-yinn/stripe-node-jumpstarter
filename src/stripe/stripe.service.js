const config = require("./stripe.config");
const stripe = require("stripe");
const adapter = require("./stripe.adapter");

/**
 * @returns {object} - une instance configurée du client d'API stripe
 */
function getStripe() {
  return stripe(config.stripeSecretKey);
}

/**
 * Récupérer la liste des plans tarifaires spécifiés dans stripe.config.js
 * @returns {array} - array of plans objects
 */
async function getPlans() {
  const plans = await Promise.all(
    config.prices.map((priceId) => {
      return getStripe()
        .plans.retrieve(priceId)
        .then((plan) => {
          return getStripe()
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
 * @returns {Promise<object>} A stripe session object
 */
async function createCheckoutSession({ user, priceId }) {
  // ligne de facturation pour notre abonnement
  const lineItem = {
    price: priceId,
    quantity: 1,
  };
  // ajout de la TVA si présente
  if (config.stripeCheckoutTaxRateId) {
    lineItem.tax_rates = [config.stripeCheckoutTaxRateId];
  }

  let checkoutConfig = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [lineItem],
    // autoriser les codes promotions
    allow_promotion_codes: true,
    // en cas de succès du paiement, le visiteur sera redirigé à cette adresse:
    success_url: config.stripeCheckoutSuccessUrl,
    // en cas d'annulation du paiement, rediriger le visiteur à cette adresse:
    cancel_url: config.stripeCheckoutCancelUrl,
    subscription_data: {},
  };

  if (config.stripeTrialPeriodDays) {
    checkoutConfig.subscription_data.trial_period_days =
      config.stripeTrialPeriodDays;
  }

  await adapter.onCreateCheckoutSession({
    user,
    checkoutConfig,
    priceId,
  });

  const session = await getStripe().checkout.sessions.create(checkoutConfig);
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

  const portalsession = await getStripe().billingPortal.sessions.create(
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
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  // on ajoute les infos du produit associé à cet abonnement
  subscription.product = await getStripe().products.retrieve(
    subscription.plan.product
  );
  return subscription;
}

module.exports = {
  getStripe,
  getPlans,
  getSubcriptionInfos,
  createCheckoutSession,
  createCustomerPortalSession,
};

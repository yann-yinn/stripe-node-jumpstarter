/**
 * @file gérer la configuration de votre gestion des abonnements
 */
module.exports = {
  // voir le fichier.env.example
  prices: process.env.STRIPE_PRICES_IDS.split(",").map((v) => v.trim()),

  // voir le fichier .env.example
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,

  // voir le fichier .env.example
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  // Addresse de redirection une fois un paiement effectué avec succès
  stripeCheckoutSuccessUrl: `${process.env.STRIPE_SITE_URL}/account`,

  // si la personne annule la commande avant de payer, on la renvoie à cette adresse
  stripeCheckoutCancelUrl: `${process.env.STRIPE_SITE_URL}/subscribe`,

  // le lien de retour depuis le "Customer Portal" (gestion des abonnements en cours)
  stripeBillingReturnUrl: `${process.env.STRIPE_SITE_URL}/account`,

  // voir le fichier .env.example
  stripeCheckoutTaxRateId: process.env.STRIPE_TAX_RATE_ID,

  // autoriser l'utilisateur à rentrer manuellement un code promo sur
  // la page du checkout
  stripeCheckoutAllowPromotionCodes: true,
};

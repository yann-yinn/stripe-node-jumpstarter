/**
 * @file gérer la configuration de votre gestion des abonnements:
 */
module.exports = {
  // voir le fichier.env.example
  prices: process.env.STRIPE_PRICES_IDS.split(",").map((v) => v.trim()),
  // voir le fichier .env.example
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  // voir le fichier .env.example
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  // Addresse de redirection une fois un paiement effectué avec succès
  //
  //{CHECKOUT_SESSION_ID} is a string literal; do not change it!
  // the actual Session ID is returned in the query parameter when your customer
  // is redirected to the success page.
  stripeCheckoutSuccessUrl: `${process.env.STRIPE_SITE_URL}/account?session_id={CHECKOUT_SESSION_ID}`,

  // si la personne annule la commande avant de payer, on la renvoie à cette adresse
  stripeCheckoutCancelUrl: `${process.env.STRIPE_SITE_URL}/subscribe`,

  // le lien de retour depuis le "Customer Portal" (gestion des abonnements en cours)
  stripeBillingReturnUrl: `${process.env.STRIPE_SITE_URL}/account`,
};

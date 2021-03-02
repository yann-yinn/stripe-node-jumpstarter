import api from "@/utils/api";

/**
 * 1) - Inclure le javascript client de Stripe.
 *
 * Il est nécessaire pour rediriger vers le formulaire de paiement
 * sur Stripe sur notre page qui affiche les plans existants.
 */
export function addStripeScript() {
  const src = "https://js.stripe.com/v3/";
  // On s'assure qu'il n'est pas déjà présent dans notre page, en cas de
  // hot-reloading ou de démontage / remontage d'un composant Vue
  if (document.querySelectorAll(`[src="${src}"]`).length === 0) {
    let stripeScript = document.createElement("script");
    stripeScript.setAttribute("src", src);
    document.head.appendChild(stripeScript);
  }
}

/**
 * Récupérer les informations complètes des plans tarifaires existants
 * pour afficher afficher nos pricings à l'utilisateur.
 */
export function getPlans() {
  return api.get(`/api/stripe/plans`);
}

/**
 * Créer une nouvelle session stripe pour commencer le process de paiement.
 * C'est cette fonction qu'on doit être appelé au clic sur un bouton "s'abonner"!
 *
 * Le serveur va alors nous renvoyer un sessionId, qu'on va transmettre à la fonction
 * stripe.redirectToCheckout() pour rediriger vers le formulaire de paiement
 * hébergé chez Stripe.
 *
 * @param {Object} options - options à passer au checkout
 * @param {Object} options.priceId : l'id du tarif de l'abonnement choisi.
 */
export function createCheckoutSession({ priceId }) {
  return api.post(`/api/stripe/create-checkout-session`, {
    priceId,
  });
}

/**
 * Redirige notre client vers le "Customer Portal" de Stripe,
 * qui lui permet de voir son historique de factures, résilier son abonnement,
 * mettre à jour ses moyens de paiement.
 */
export function redirectToCustomerPortal() {
  api.post(`/api/stripe/create-customer-portal-session`).then((response) => {
    window.location.href = response.data.url;
  });
}

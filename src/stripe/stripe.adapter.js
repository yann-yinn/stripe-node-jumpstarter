const oid = require("mongodb").ObjectID;
const { db } = require("../utils/db");

/**
 * Ces fonctions sont appelés lors d'évènements spécifiques du module Stripe
 * pour faire la glue entre Stripe et votre propre base de données
 */
module.exports = {
  /**
   * @param {Object} options
   * @param {Object} options.user - objet user complet
   * @param {Object} options.checkoutConfig - la configuration pour le checkout de Stripe
   */
  async onCreateCheckoutSession({ user, checkoutConfig }) {
    // on récupère les informations complète de l'utilisateur connecté
    const fullUser = await db()
      .collection("users")
      .findOne({ _id: oid(user.id) });
    const customerId = fullUser.stripeCustomerId;

    /**
     * propriété "customer":
     *
     * Si on a déjà un customerId stripe pour le user qui passe commande,
     * on doit le renseigner ici pour que Stripe reconnaisse le client
     * et ne crée pas un nouveau compte client pour cet utilisateur.
     */
    if (customerId) {
      checkoutConfig.customer = customerId;
    }

    /**
     * propriété "client_reference_id"
     *
     * Passez ici l'id de votre utilisateur local.
     *
     * Ainsi, dans le webhook "checkout.session.completed", vous pourrez
     * retrouver votre id utilisateur local en inspectant la clef session.client_reference_id
     */
    checkoutConfig.client_reference_id = user.id;

    /**
     * propriété "metadata"
     *
     * Elle pourra être retrouvée dans le webhook "checkout.session.completed"
     *
     * vous pouvez passez ici toutes les infos qui vous seront utiles au retour du webhook
     * pour mettre à jour vos propres données.
     */
    checkoutConfig.metadata = {};
  },

  /**
   * Quand Stripe a terminé une commande avec succès ou tout autre évènement
   * majeur, ce code sera appelé.
   *
   * @param {Object} arguments
   * @param {Object} arguments.event - l'evenement Stripe
   */
  async onWehbooks({ event }) {
    switch (event.type) {
      // Le paiement est un succès et l'abonnement a été crée!
      case "checkout.session.completed":
        const session = event.data.object;

        console.log(JSON.stringify(session, 0, 2));

        // On met à jour pour notre utilisateur, a minima:
        // - son id client chez Stripe
        // - l'id de l'abonnement
        await db()
          .collection("users")
          .updateOne(
            { _id: oid(session.client_reference_id) },
            {
              $set: {
                stripeCustomerId: session.customer, // set by stripe
                stripeSubscriptionId: session.subscription, // set by Stripe
              },
            }
          );

        break;

      /**
       * Un abonnement a été upgradé ou downgradé
       */
      case "customer.subscription.updated":
        break;

      /**
       * Un abonnement a été annulé ou est arrivé à sa fin.
       */
      case "customer.subscription.deleted":
        break;

      case "invoice.payment_failed":
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.

        break;

      default:
      // Unhandled event type
    }
  },

  /**
   * étape 3 - pour que votre utilisateur puisse accéder au "Customer portal",
   * il faut récupérer son id client (customer id) et le passer à la config
   * du portail client !
   *
   * @param {Object} options
   * @param {Object} options.user - l'objet user complet
   * @return {String} customerId - l'id client Stripe pour générer l'url vers le portail client
   */
  async onCreateCustomerPortalSession({ user, portalSessionConfig }) {
    const fullUser = await db()
      .collection("users")
      .findOne({ _id: oid(user.id) });
    portalSessionConfig.customer = fullUser.stripeCustomerId;
  },
};

const oid = require("mongodb").ObjectID;
const { db } = require("../utils/db");

/**
 * Ces fonctions sont appelées par les controllers du dossier ./controllers
 */
module.exports = {
  /**
   * étape 1 - on créer la configuration pour le formulaire de checkout.
   *
   * @param {Object} arguments
   * @param {Object} arguments.req - l'objet http request du controller
   * @param {Object} arguments.checkoutConfig - la configuration pour le checkout de Stripe
   * @param {String} arguments.priceId - l'id du plan choisi par l'utilisateur
   */
  async onCreateCheckoutSession({ req, checkoutConfig, priceId }) {
    // on récupère les informations complète de l'utilisateur connecté
    const fullUser = await db()
      .collection("users")
      .findOne({ _id: oid(req.user.id) });
    const customerId = fullUser.stripeCustomerId;

    /**
     * propriété "customer"
     *
     * Si on a déjà un customerId stripe pour le user qui passe commande,
     * on doit le renseigner ici pour que Stripe reconnaisse le client
     * et ne crée pas un nouveau compte client à chaque nouvelle commande.
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
    checkoutConfig.client_reference_id = req.user.id;

    /**
     * propriété "metadata"
     *
     * Elle pourra être retrouvée dans le webhook "checkout.session.completed"
     *
     * On peut par exemple y mettre l'id du plan sélectionné par l'utilisateur.
     *
     * vous pouvez passez ici toutes les infos qui vous seront utiles au retour du webhook
     * pour mettre à jour vos propres données.
     */
    checkoutConfig.metadata = { price: priceId };
  },

  /**
   * étape 2 - quand Stripe a terminé une commande avec succès ou tout autre évènement
   * majeur, ce code sera appelé par Stripe pour vous permettre de mettre à jour votre
   * base de données en fonction des infos envoyées par Stripe.
   *
   * @param {Object} arguments
   * @param {Object} arguments.event - l'evenement Stripe
   */
  async onWehbooks({ event }) {
    switch (event.type) {
      // Le paiement est un succès et l'abonnement a été crée!
      case "checkout.session.completed":
        const session = event.data.object;
        // console.log(JSON.stringify(session, 0, 2));

        await db()
          .collection("users")
          .updateOne(
            { _id: oid(session.client_reference_id) },
            {
              $set: {
                stripePriceId: session.metadata.price, // metadata are set in onCreateCheckoutSession()
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
        const subscriptionUpdated = event.data.object;
        break;

      /**
       * Un abonnement a été annulé ou est arrivé à sa fin.
       * Mettez à jour ici le status de l'abonnement de votre utilisateur
       */
      case "customer.subscription.deleted":
        break;

      case "invoice.payment_failed":
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.

        break;

      case "invoice.paid":
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.

        break;

      default:
      // Unhandled event type
    }
  },

  /**
   * étape 3 - pour que votre utilisateur puisse accéder au "Customer portal"
   *
   * @param {Object} arguments
   * @param {Object} arguments.req - l'objet http request du controller
   * @return {String} customerId - l'id client Stripe pour générer l'url vers le portail client
   */
  async onCreateCustomerPortalSession({ req }) {
    const fullUser = await db()
      .collection("users")
      .findOne({ _id: oid(req.user.id) });
    customerId = fullUser.stripeCustomerId;
    return customerId;
  },
};

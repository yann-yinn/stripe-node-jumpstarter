const config = require("../config");
const stripe = require("stripe")(config.stripeSecretKey);
const { db } = require("../../utils/db");

/**
 * Stripe appelera ce controller lorsqu'un achat est terminé ou lors
 * d'autres évènements clefs concernant l'abonnement.
 *
 * C'est l'endroit idéal pour mettre à jour votre utilisateur
 * avec les infos de son abonnement (status de l'abonnement, id client Stripe)
 */
module.exports = async (request, response) => {
  const signature = request.headers["stripe-signature"];
  let event;

  if (!config.stripeWebhookSecret) {
    response.status(400);
    response.send({
      error: {
        message: "config.stripeWebhookSecret is not defined",
      },
    });
  }

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      config.stripeWebhookSecret
    );
  } catch (e) {
    console.log("e", e);
    response.status(400).send({
      error: {
        message: e.message,
      },
    });
  }

  switch (event.type) {
    // Le paiement est un succès et l'abonnement a été crée!
    case "checkout.session.completed":
      const session = event.data.object;

      console.log(JSON.stringify(session, 0, 2));

      /*==============================
       * @STRIPE_TO_COMPLETE
       *
       * Mettre à jour ici votre utilisateur. Persister:
       *
       * - le customerId: event.customer. Nécessaire pour ouvrir son portail client.
       * - (optionnel) l'id du plan choisi: event.metadata.price
       * - (optionnel) le status de l'abonnement (ex: "user.subscriptionStatus = ACTIVE")
       *==============================*/

      const user = await db()
        .collection("users")
        .findOne({ _id: ObjectId(session.client_reference_id) });

      /* EXAMPLE:
        user.update({
           id: user.id, 
           customer: session.customer, // customerId
           subscription: session.subscription, // subscriptionId
           price: session.metadata.price, // priceId
           subscriptionStatus: "ACTIVE", 
           },
         })
         */

      /*==============================
       * @END_STRIPE_TO_COMPLETE
       *==============================*/

      break;
    /*==============================
     * @END_STRIPE_TO_COMPLETE
     *==============================*/
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
      const subscriptionDeleted = event.data.object;
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
    /*==============================
     * @END_STRIPE_TO_COMPLETE
     *==============================*/

    default:
    // Unhandled event type
  }

  response.sendStatus(200);
};

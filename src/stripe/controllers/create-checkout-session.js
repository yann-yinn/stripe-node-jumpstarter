const config = require("../config");
const stripe = require("stripe")(config.stripeSecretKey);

/**
 * Créer une nouvelle session Stripe: tout processus de paiement
 * commence en appelant ce endpoint.
 */
module.exports = async (req, res) => {
  const { priceId } = req.body;

  if (!priceId) {
    res.status(400);
    res.send({
      error: {
        message:
          'Error: "priceId" is missing. Your request body Should contain a stringified JSON with a priceId property: {"priceId": "abc"}',
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
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

      /*==============================
       * @STRIPE_TO_COMPLETE
       *==============================*/

      /**
       * propriété "customer"
       *
       * Si on a déjà un customerId stripe pour le user qui passe commande,
       * on doit le renseigner ici pour que Stripe reconnaisse le client
       * et ne crée pas un nouveau client à chaque nouvelle commande.
       */

      // EXEMPLE
      // customer: req.user.id,

      /**
       * propriété "client_reference_id"
       *
       * Passez ici l'id de votre utilisateur.
       * Ainsi, dans le webhook "checkout.session.completed", vous pourrez
       * retrouver votre id utilisateur local en inspectant la clef client_reference_id
       */

      // EXEMPLE:
      client_reference_id: req.user.id,

      /**
       * propriété "metadata"
       *
       * Elle pourra être retrouvée dans le webhook "checkout.session.completed"
       * On peut par exemple y mettre l'id du plan sélectionné par l'utilisateur.
       * vous pouvez passez ici toutes les infos qui vous seront utiles au retour du webhook
       * pour mettre à jour vos propres données.
       */

      metadata: { price: priceId },

      /*==============================
       * @END_STRIPE_TO_COMPLETE
       *==============================*/
    });
    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};

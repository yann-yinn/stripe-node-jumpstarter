const config = require("../config");
const stripe = require("stripe")(config.stripeSecretKey);
const hooks = require("../hooks");

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

  hooks.onWehbooks(event);

  response.sendStatus(200);
};

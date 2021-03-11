const config = require("../config");
const stripe = require("stripe")(config.stripeSecretKey);
const hooks = require("../hooks");

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
    const checkoutConfig = {
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

    hooks.onCreateCheckoutSession({ req, checkoutConfig, priceId });

    const session = await stripe.checkout.sessions.create(checkoutConfig);
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

const config = require("../config");
const stripe = require("stripe")(config.stripeSecretKey);

/**
 * Récupérer la liste complète des plans à afficher sur le front-end.
 * voir dans le fichier .env la variable STRIPE_PRICES_IDS
 */
module.exports = async (req, res) => {
  try {
    const plans = await Promise.all(
      config.prices.map((priceId) => {
        return stripe.plans.retrieve(priceId).then((plan) => {
          return stripe.products.retrieve(plan.product).then((product) => {
            plan.product = product;
            return plan;
          });
        });
      })
    );
    res.send({ plans });
  } catch (e) {
    res.status(400);
    return res.send({
      error: { message: e.message },
    });
  }
};

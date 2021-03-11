/**
 * @file routes pour l'API de gestion des abonnements avec stripe
 */
const stripeControllers = require("./controllers/index");
const express = require("express");
const router = express.Router();
const userManagement = require("express-user-management");

router.get("/api/stripe/plans", stripeControllers.plans);

router.post(
  "/api/stripe/create-checkout-session",
  userManagement.auth.required,
  stripeControllers.createCheckoutSession
);

router.post(
  "/api/stripe/create-customer-portal-session",
  userManagement.auth.required,
  stripeControllers.createCustomerPortalSession
);

// ⚠️ ATTENTION, ici le request.body ne doit JAMAIS être modifié par un middleware express,
// sinon la vérification de signature de stripe signature échouera
router.post("/api/stripe/webhooks", stripeControllers.webhooks);

module.exports = router;

/**
 * @file routes pour l'API de gestion des abonnements avec stripe
 */
const stripeController = require("./stripe.controller");
const express = require("express");
const router = express.Router();
const userManagement = require("express-user-management");

router.get("/api/stripe/plans", stripeController.plans);

router.post(
  "/api/stripe/create-checkout-session",
  userManagement.auth.required,
  stripeController.createCheckoutSession
);

router.post(
  "/api/stripe/create-customer-portal-session",
  userManagement.auth.required,
  stripeController.createCustomerPortalSession
);

// ⚠️ ATTENTION, ici le request.body ne doit JAMAIS être modifié par un middleware express,
// sinon la vérification de signature de stripe signature échouera
router.post("/api/stripe/webhooks", stripeController.webhooks);

module.exports = router;

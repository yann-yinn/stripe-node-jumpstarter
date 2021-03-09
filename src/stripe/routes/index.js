/**
 * @file routes pour l'API REST de gestion des abonnements.
 * Voir documentation dans "controllers/stripe.controller"
 */
const stripeController = require("../controllers/index");
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const userManagement = require("../../utils/userManagement");

router.get("/api/stripe/plans", stripeController.plans);

router.post(
  "/api/stripe/create-checkout-session",
  userManagement.get().auth.required,
  stripeController.createCheckoutSession
);

router.post(
  "/api/stripe/create-customer-portal-session",
  userManagement.get().auth.required,
  stripeController.createCustomerPortalSession
);

/**
 * !! ATTENTION, request.body ne doit JAMAIS être modifié par un middleware express,
 * sinon la vérification de signature de stripe signature échoue !!
 */
router.post(
  "/api/stripe/webhooks",
  bodyParser.raw({ type: "*/*" }),
  stripeController.webhooks
);

module.exports = router;

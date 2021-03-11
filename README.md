# Stripe Node Boilerplate

## installation locale de la démo

```sh
cd front
npm install
# éditez les variables d'environnements!
cp .env.example .env.local
# démarrer l'API
npm run dev

cd -
cd server
npm install
# éditez les variables d'environnements!
cp .env.example .env
# démarrer l'API
npm run dev
```

## Erreurs fréquentes

### StripeSignatureVerificationError

```
StripeSignatureVerificationError: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing
```

Deux possibilités:

1. Vous n'avez pas entré comme il faut votre "STRIPE_WEBHOOK_SECRET" dans les variables d'environnement et donc la vérification de la signature échoue.

Solution: se rendre sur https://dashboard.stripe.com/test/webhooks et vérifier que le webhook secret renseigné par STRIPE_WEBHOOK_SECRET est le bon

2. La requête http POST vers `/api/stripe/webhooks` est modifiée, par exemple par un middleware express qui va transformer automatiquement le corps en JSON avec la fonctin JSON.parse(): cela fait également échoué le contrôle de la signature.

Solution: si vous utilisez Express, assurez vous que le middleware JSON n'est pas appliqué à votre route Stripe:

```js
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhooks") {
    bodyParser.raw({ type: "*/*" })(req, res, next);
  } else {
    bodyParser.json({ limit: "5mb" })(req, res, next);
  }
});
```

### mes informations Stripe ne sont pas enregistrées par le webhook

1. Vérifier que votre webhook est bien appelé: se rendre sur https://dashboard.stripe.com/test/webhooks et vérifier que l'url renseignée renvoie bien vers une url valide vers votre application

2. Vérifier que ce webhook est correctement configuré: on peut choisir quels évènements sont envoyés: vérifier que vous n'avez pas fait d'erreurs sur la liste d'évènements envoyés.

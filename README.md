# Stripe Node Starter

## getting started

Pour que la démo fonctionne, vous devez avoir préalablement:

- crée un compte Stripe et l'avoir configuré (voir section "Configurer Stripe en détails")

- Avoir créer une base de données mongodb. Vous pouvez par exemple créer une base de donnée en ligne sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### installation du code de la démo

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

### Configurer Stripe

1 - Créer un compte sur Stripe

2 - Se rendre sur [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products) pour ajouter des abonnements et leur tarifs sur l'environnement de test. Exemple:

- Plan basic mensuel à 9€/mois
- Plan basic annuel à 90€/an
- Plan premium mensuel à 19€/mois
- Plan premium annuel à €190/an

3 - Récupérer vos [clefs d'API](https://dashboard.stripe.com/test/apikeys)

La "clé publique" sera pour votre front-end (variable `VUE_APP_STRIPE_PUBLISHABLE_KEY`) et la clef secrète pour votre serveur node: `STRIPE_SECRET_KEY`.

4 - Configurer un webhook:

Quand une commande Stripe est terminée, on a besoin d'avertir notre serveur. Pour cela il faut créer un webhook: [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks), qui devra taper sur l'url suivante "http://{{votre-api}}/stripe/webhooks" de votre API Node.

Le starter crée automatiquement un tunnel vers votre localhost pour vous, avec une url du type: https://node-stripe-starter-600308910def.loca.lt/api/stripe/webhooks que vous pouvez utilisez à cet effet.

5 - Configurer votre Customer Portal

Vous devez configurer sur cette page d'administration les plans qui apparaitront sur le portail Client: (il sera possible d'upgrader / downgrader un abonnement vers les plans sélectionnés)

https://dashboard.stripe.com/test/settings/billing/portal

## Erreurs fréquentes

### StripeSignatureVerificationError

```
StripeSignatureVerificationError: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing
```

Deux possibilités:

1. Vous n'avez pas entré comme il faut votre "STRIPE_WEBHOOK_SECRET" dans les variables d'environnement et donc la vérification de la signature échoue.

Solution: se rendre sur https://dashboard.stripe.com/test/webhooks et vérifier que le webhook secret renseigné par STRIPE_WEBHOOK_SECRET est le bon

2. La requête http POST vers `/api/stripe/webhooks` est modifiée, par exemple par un middleware express qui va transformer automatiquement le corps en JSON avec la fonctin JSON.parse(): cela fait échouer le contrôle de la signature.

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

### Mon endpoint "/api/stripe/webhooks" ne semble pas appelé par Stripe

1. Vérifier que votre webhook est bien appelé: se rendre sur https://dashboard.stripe.com/test/webhooks et vérifier que l'url renseignée renvoie bien vers une url valide de votre application.

2. Vérifier que ce webhook est correctement configuré. On peut choisir quels évènements sont envoyés: vérifier que vous n'avez pas fait d'erreurs sur la liste d'évènements envoyés.

## Checklist globale

-[ ] J'ai bien installé le code (npm install)

-[ ] J'ai bien renseignée TOUTES les variables d'environnement correctement côté serveur ET côté front-end

-[ ] J'ai bien configuré Stripe comme il faut: produits, webhooks, customer portal...

-[ ] J'ai bien ouvert un tunnel en local vers /api/stripe/webhooks

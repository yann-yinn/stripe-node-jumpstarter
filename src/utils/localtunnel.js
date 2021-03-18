const localtunnel = require("localtunnel");

module.exports = async () => {
  const subdomain = process.env.STRIPE_LOCALTUNNEL_SUBDOMAIN;
  const tunnel = await localtunnel({ port: process.env.PORT, subdomain });
  console.log(
    `\n`,
    `Tunnel localhost ouvert: vous pouvez configurer votre webhook stripe (https://dashboard.stripe.com/test/webhooks) avec l'url suivante: `,
    `\n`,
    `🔗 ${tunnel.url}/api/stripe/webhooks`,
    `\n`,
    `N'oubliez pas de renseigner ensuite votre variable d'environnement STRIPE_WEBHOOK_SECRET avec la clé secrète`
  );
};

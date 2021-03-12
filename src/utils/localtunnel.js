const localtunnel = require("localtunnel");
macaddress = require("macaddress");

module.exports = async () => {
  const macadress = await macaddress.one();
  const subdomain = "node-stripe-starter-" + macadress.replace(/:/g, "");
  const tunnel = await localtunnel({ port: process.env.PORT, subdomain });

  tunnel.url;
  console.log(
    `\n`,
    `Tunnel localhost ouvert: vous pouvez configurer votre webhook stripe (https://dashboard.stripe.com/test/webhooks) avec l'url suivante: `,
    `\n`,
    `🔗 ${tunnel.url}/api/stripe/webhooks`,
    `\n`,
    `N'oubliez pas de renseigner ensuite votre variable d'environnement STRIPE_WEBHOOK_SECRET avec la clé secrète`
  );

  tunnel.on("close", () => {
    // tunnels are closed
  });
};

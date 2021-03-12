const bootstrap = require("./utils/bootstrap");
const app = require("./utils/express");
const localtunnel = require("./utils/localtunnel");

bootstrap().then(() => {
  app.use(require("./routes"));
  app.use(require("./stripe/routes"));
  app.listen(process.env.PORT, () => {
    console.log(
      `✨ Server app listening on port http://localhost:${process.env.PORT}!`
    );
  });
  // open a local tunnel for stripe webhooks
  if (process.env.NODE_ENV === "development") {
    localtunnel();
  }
});

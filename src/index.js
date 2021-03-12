const bootstrap = require("./utils/bootstrap");
const app = require("./utils/express");

bootstrap().then(() => {
  app.use(require("./routes"));
  app.use(require("./stripe/routes"));
  app.listen(process.env.PORT, () => {
    console.log(
      `server app listening on port http://localhost:${process.env.PORT}!`
    );
  });
});

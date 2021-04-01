const { init, serve } = require("./utils/app");

init().then((app) => {
  app.use(require("./routes"));
  app.use(require("./stripe/stripe.routes"));
  serve(app);
});

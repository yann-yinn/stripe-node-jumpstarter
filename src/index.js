const app = require("./utils/express");
const userManagement = require("express-user-management");
const userManagementConfig = require("./config/user-management");
const { connect } = require("./utils/db");

Promise.all([connect(), userManagement.init(app, userManagementConfig)]).then(
  () => {
    app.use(require("./routes"));
    app.use(require("./stripe/routes"));
    app.listen(process.env.PORT, () => {
      console.log(
        `✨ Server app listening on port http://localhost:${process.env.PORT}!`
      );
    });
    // ouvrir un tunnel local pour réceptionner les webhooks de stripe en local
    if (process.env.NODE_ENV === "development") {
      require("./utils/localtunnel")();
    }
  }
);

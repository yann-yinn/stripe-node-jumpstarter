const userManagement = require("express-user-management");

module.exports = async (expressApp) => {
  await userManagement.init(expressApp, {
    mongoUrl: process.env.MONGO_URL,
    activationRequired: false,
    usersTable: "users",
    jwtSecret: process.env.JWT_SECRET || "secret",
    mails: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
  });
};

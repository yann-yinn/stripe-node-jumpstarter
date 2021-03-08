const userManagement = require("express-user-management");
const { get } = require("express-user-management/src/options");

let instance = null;

module.exports = {
  getInstance() {
    return instance;
  },
  async init(app) {
    await userManagement.init(app, {
      mongoUrl: process.env.MONGO_URL,
      activationRequired: false,
      usersTable: "users",
      jwtSecret: process.env.JWT_SECRET || "secret",
      passwordResetAdress: process.env.BASE_URL + "/passwordReset/",
      accountActivationAdress: process.env.BASE_URL,
      apiKey: {
        table: "projects",
        documentKey: "apiKey.apiKey",
      },
      mails: {
        apiKey: process.env.SENDGRID_API_KEY,
        activation: {
          subject: "Activate your account!",
          sender: process.env.EMAIL_SENDER,
          body: `Almost done!
             Please click this link to activate your account!

             https://social-gallery.net/activate-email?{{user.activation.code.apiKey}}`,
        },
        passwordReset: {
          subject: "Password reset link",
          sender: "accounts@gwenp.fr",
          body: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
            Please click on the following link, or paste this into your browser to complete the process:
            {{passwordResetAdress}}?{{token}}
            If you did not request this, please ignore this email and your password will remain unchanged.`,
        },
      },
    });
    instance = userManagement;
    return instance;
  },
};

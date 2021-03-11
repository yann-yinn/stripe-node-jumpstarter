const userManagement = require("express-user-management");

async function init(app) {
  await userManagement.init(app, {
    mongoUrl: process.env.MONGO_URL,
    activationRequired: false,
    usersTable: "users",
    jwtSecret: process.env.JWT_SECRET || "secret",
    passwordResetAdress: process.env.BASE_URL + "/passwordReset/",
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
  return userManagement;
}

module.exports = {
  init: (app) => init(app),
  get() {
    return userManagement;
  },
};

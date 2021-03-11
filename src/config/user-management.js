module.exports = {
  mongoUrl: process.env.MONGO_URL,
  activationRequired: false,
  usersTable: "users",
  jwtSecret: process.env.JWT_SECRET,
  mails: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
};

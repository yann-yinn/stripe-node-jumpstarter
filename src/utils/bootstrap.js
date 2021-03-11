const app = require("./express");
const initUserManagement = require("./user-mangement-init");
const { connect } = require("./db");

module.exports = async () => {
  await Promise.all([
    // connection à notre base de données
    connect(),
    // démarrer l'API de gestion des utilisateurs
    initUserManagement(app),
  ]);
};

const expressApp = require("./express");
const userManagement = require("express-user-management");
const userManagementConfig = require("../config/user-management");
const { connect } = require("./db");

module.exports = async () => {
  await Promise.all([
    // connection à notre base de données
    connect(),
    // démarrer l'API de gestion des utilisateurs
    userManagement.init(expressApp, userManagementConfig),
  ]);
};

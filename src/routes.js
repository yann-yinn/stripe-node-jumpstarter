const userController = require("./controllers/user.controller");
const express = require("express");
const router = express.Router();
const userManagement = require("express-user-management");

router.get(
  "/api/userinfo",
  userManagement.auth.required,
  userController.userInfo
);

module.exports = router;

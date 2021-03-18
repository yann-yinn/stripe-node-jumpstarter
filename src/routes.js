const appControllers = require("./controllers/index");
const express = require("express");
const router = express.Router();
const userManagement = require("express-user-management");

router.get(
  "/api/userinfo",
  userManagement.auth.required,
  appControllers.userInfo
);

module.exports = router;

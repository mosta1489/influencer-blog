const route = require("express").Router();
const adminController = require("../controllers/adminController");
const gardLogin = require("./guard/checkLogin");
const gardAdmin = require("./guard/checkAdmin");

route.get(
  "/",
  gardLogin.isLoggedIn,
  gardAdmin.checkAdmin,
  adminController.getAdminPage
);

module.exports = route;

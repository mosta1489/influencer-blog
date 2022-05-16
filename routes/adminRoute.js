const route = require("express").Router();
const adminController = require("../controllers/adminController");
const gardLogin = require("./guard/checkLogin");
const gardAdmin = require("./guard/checkAdmin");

// =========== get admin page ==================
route.get(
  "/",
  gardLogin.isLoggedIn,
  gardAdmin.checkAdmin,
  adminController.getAdminPage
);
// =============================================

// ========== delete a user ====================
route.post("/deleteUser", gardAdmin.checkAdmin, adminController.deleteUser);
// =============================================

module.exports = route;

const route = require("express").Router();
const userController = require("../controllers/userController");
const gardsUser = require("./guard/checkLogin");
const gardsAdmin = require("./guard/checkAdmin");

// ========= save a post ======================
route.post("/savePost", gardsUser.isLoggedIn, userController.savePost);
// ============================================

// ========== add a new comment ===============
route.post("/addComment", gardsUser.isLoggedIn, userController.addComment);
// ============================================

module.exports = route;

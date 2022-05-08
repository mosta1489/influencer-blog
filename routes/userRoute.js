const route = require("express").Router();
const userController = require("../controllers/userController");
const gardsUser = require("./guard/checkLogin");
const gardsAdmin = require("./guard/checkAdmin");

// ========= save a post ======================
route.post("/savePost", gardsUser.isLoggedIn, userController.savePost);
// ============================================

// =========== create post route ============
route.post("/addPost", userController.addPost);
// ==========================================

// ========== add a new comment ===============
route.post("/addComment", gardsUser.isLoggedIn, userController.addComment);
// ============================================

// ========== delete a post ===============

// ============================================
route.post("/deletePost", gardsUser.isLoggedIn, userController.deletePost);
// ========== delete a comment ===============
route.post(
  "/deleteComment",
  gardsUser.isLoggedIn,
  userController.deleteComment
);
// ============================================

module.exports = route;

const route = require("express").Router();
const userController = require("../controllers/userController");
const gardsUser = require("./guard/checkLogin");
const gardsAdmin = require("./guard/checkAdmin");

// ========= save a post ======================
route.post("/savePost", gardsUser.isLoggedIn, userController.savePost);
// ============================================

// ========= remove post from saved ===========
route.post("/unSavePost", gardsUser.isLoggedIn, userController.unSavePost);
// ============================================

// =========== create post route ============
route.post("/addPost", userController.addPost);
// ==========================================

// ========== add a new comment route =========
route.post("/addComment", gardsUser.isLoggedIn, userController.addComment);
// ============================================

// ========== delete a post route =============
route.post("/deletePost", gardsUser.isLoggedIn, userController.deletePost);
// ============================================

// ========== edit a post route =============

route.post("/editPost", gardsUser.isLoggedIn, userController.editPost);

// ============================================

// ========== edit a comment route ===========
route.post("/editComment", gardsUser.isLoggedIn, userController.editComment);
// ============================================

// ========== delete a comment route ==========
route.post(
  "/deleteComment",
  gardsUser.isLoggedIn,
  userController.deleteComment
);
// ============================================

// ========== saved massage route  ============
route.get("/savedPosts", gardsUser.isLoggedIn, userController.savedPosts);
// ============================================

// ========== setting page route ===============
route.get("/setting", gardsUser.isLoggedIn, userController.getSettingPage);
// =============================================

// ========== edit user route ==================
route.post("/editUser", gardsUser.isLoggedIn, userController.updateUserData);
// ============================================

// ========== change password route ============
route.post(
  "/changePassword",
  gardsUser.isLoggedIn,
  userController.changePassword
);
// =============================================

// ========== profile page route ===============
route.get("/profile", gardsUser.isLoggedIn, userController.getProfilePage);
// =============================================
module.exports = route;

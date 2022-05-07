const route = require("express").Router();
const homeController = require("../controllers/homeController");
const gardsUser = require("./guard/checkLogin");
const gardsAdmin = require("./guard/checkAdmin");

// =========== getHomePage route ===========
route.get("/", homeController.getHomePage);
// ==========================================

// =========== create post route ============
route.post("/addPost", homeController.addPost);
// ==========================================

// ======== get post page ===================
route.get("/post", gardsUser.isLoggedIn, homeController.getPostPage);
// ==========================================

module.exports = route;

const route = require("express").Router();
const userController = require("../controllers/userController");
const gardsUser = require("./guard/checkLogin");
const gardsAdmin = require("./guard/checkAdmin");

route.post("/savePost", gardsUser.isLoggedIn, userController.savePost);

module.exports = route;

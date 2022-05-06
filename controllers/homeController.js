// const productModel = require("../models/productModel");
const configFile = require("config");

// getHomePage function
function getHomePage(req, res, next) {
  res.render("home", {
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    userName: req.session.userName,
    fullName: req.session.fullName,
  });
}

exports.getHomePage = getHomePage;

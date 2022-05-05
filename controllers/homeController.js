// const productModel = require("../models/productModel");
const configFile = require("config");

// getHomePage function
function getHomePage(req, res, next) {
  res.render("home");
}

exports.getHomePage = getHomePage;

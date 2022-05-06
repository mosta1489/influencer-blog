const userModel = require("../models/userModel");

const config = require("config");
const fs = require("fs");

async function getAdminPage(req, res) {
  res.render("admin", {
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    fullName: req.session.fullName,
  });
}

exports.getAdminPage = getAdminPage;

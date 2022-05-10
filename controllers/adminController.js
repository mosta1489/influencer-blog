const userModel = require("../models/userModel");

const config = require("config");
const fs = require("fs");

async function getAdminPage(req, res) {
  res.render("admin", {
    error: req.flash("error")[0],
    success: req.flash("success")[0],
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    userName: req.session.userName,
    fullName: req.session.fullName,
    userImage: req.session.userImage,
  });
}

exports.getAdminPage = getAdminPage;

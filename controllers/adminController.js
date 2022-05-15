const userModel = require("../models/userModel");

const config = require("config");
const fs = require("fs");

async function getAdminPage(req, res) {
  usersData = function getUserData(userName) {
    return new Promise((resolve, reject) => {
      connection()
        .then(async () => {
          const userData = await userModel.findall({ userName: userName });
          resolve(userData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  res.render("admin", {
    error: req.flash("error")[0],
    success: req.flash("success")[0],
    isAdmin: req.session.isAdmin,
    isLoggedIn: req.session.userId,
    userName: req.session.userName,
    fullName: req.session.fullName,
    userImage: req.session.userImage,
    userPlan: req.session.userPlan
  });
}


exports.getAdminPage = getAdminPage;

const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");

const config = require("config");
const fs = require("fs");

// ========= get admin page ====================
async function getAdminPage(req, res) {
  const messages = await userModel.getUserData(req.session.userName);
  const allUsers = await userModel.getAllUsersNames();

  const contOfPost = await postModel.contOfPost();
  const contOfUser = await userModel.contOfUser();
  const largePost = await postModel.getLargePost();

  userModel
    .getAllUser()
    .then((usersData) => {
      res.render("admin", {
        messages: messages.messages,
        allUsers: allUsers,
        usersData: usersData,
        largePost: largePost,
        contOfPost: contOfPost[0].contOfPost,
        contOfUser: contOfUser[0].contOfUser,
        error: req.flash("error")[0],
        success: req.flash("success")[0],
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.userId,
        userName: req.session.userName,
        fullName: req.session.fullName,
        userImage: req.session.userImage,
        userPlan: req.session.userPlan,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirct("/");
    });
}
// =============================================

// =============================================
async function deleteUser(req, res) {
  const allPostsId = await postModel.getUserPostsId(req.body.userName);
  await postModel.deleteUserPosts(req.body.userName);
  for (let i = 0; i < allPostsId.length; i++) {
    await commentModel.deletePostComments(allPostsId[i].id);
  }
  userModel.deleteUser(req.body.userName).then((result) => {
    req.flash("success", result);
    res.redirect("/admin");
  });
}
// =============================================

exports.getAdminPage = getAdminPage;
exports.deleteUser = deleteUser;

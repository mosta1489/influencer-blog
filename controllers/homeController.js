const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const configFile = require("config");

// ==============  getHomePage function ====================
// var messages = { messages: [] };
async function getHomePage(req, res, next) {
  if (req.session.userName) {
    messages = await userModel.getUserData(req.session.userName);
  }
  const allUsers = await userModel.getAllUsersNames();
  postModel
    .getAllPosts()
    .then((posts) => {
      res.render("home", {
        posts: posts,
        messages: messages.messages.reverse(),
        allUsers: allUsers,
        error: req.flash("error")[0],
        success: req.flash("success")[0],
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.userId,
        userName: req.session.userName,
        fullName: req.session.fullName,
        userPlan: req.session.userPlan,
        userImage: req.session.userImage,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
// ===========================================================

// =========== get post page =================================
async function getPostPage(req, res) {
  const messages = await userModel.getUserData(req.session.userName);
  const allUsers = await userModel.getAllUsersNames();

  const postData = req.query;
  postModel
    .getPostData(postData)
    .then((result) => {
      res.render("postPage", {
        post: result,
        messages: messages.messages.reverse(),
        allUsers: allUsers,
        error: req.flash("error")[0],
        success: req.flash("success")[0],
        isAdmin: req.session.isAdmin,
        isLoggedIn: req.session.userId,
        userName: req.session.userName,
        fullName: req.session.fullName,
        userPlan: req.session.userPlan,
        userImage: req.session.userImage,
      });
    })
    .catch((err) => console.log(err));
  // res.send("post page");
}
// ===========================================================

exports.getHomePage = getHomePage;
exports.getPostPage = getPostPage;

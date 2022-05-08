const postModel = require("../models/postModel");
const configFile = require("config");

// ==============  getHomePage function ====================
function getHomePage(req, res, next) {
  postModel
    .getAllPosts()
    .then((posts) => {
      res.render("home", {
        posts: posts,
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
function getPostPage(req, res) {
  const postData = req.query;
  postModel
    .getPostData(postData)
    .then((result) => {
      res.render("postPage", {
        post: result,
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

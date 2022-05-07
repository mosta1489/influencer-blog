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
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
// ===========================================================

// ============== add Post function ==========================
function addPost(req, res, next) {
  var image = "";
  const postData = req.body;
  if (req.files) {
    image = req.files.image;
  }
  if (!req.files && !postData.title) {
    req.flash("error", "Please upload an image or enter a title ");
    return res.redirect("/");
  } else {
    postModel
      .addPost(postData, image)
      .then((result) => {
        req.flash("success", result);
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("error", err);
        res.redirect("/");
      });
  }
}
// ===========================================================

exports.getHomePage = getHomePage;
exports.addPost = addPost;

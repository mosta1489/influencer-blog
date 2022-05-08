const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");

// ======== save a post =======================
function savePost(req, res) {
  const userName = req.body.userName;
  const postId = req.body.postId;
  console.log(req.body);
  userModel
    .savePost(userName, postId)
    .then((result) => {
      req.flash("success", result);
      if (req.body.path) {
        res.redirect(req.body.path);
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      req.flash("error", error);
      if (req.body.path) {
        res.redirect(req.body.path);
      } else {
        res.redirect("/");
      }
    });
}
// ============================================

// ============== create new Post function ==========================
function addPost(req, res, next) {
  var image = "";
  const postData = req.body;
  postData.userImage = req.session.userImage;
  postData.fullName = req.session.fullName;
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

// ========= add new comment to post ==========
function addComment(req, res) {
  const comment = req.body;
  commentModel
    .addNewComment(comment)
    .then((result) => {
      // console.log(result);
      if (req.body.path) {
        res.redirect(req.body.path);
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      console.log(error);
      if (req.body.path) {
        res.redirect(req.body.path);
      } else {
        res.redirect("/");
      }
    });
}
// ============================================

// ========= delete a comment  ===============
function deletePost(req, res) {
  const postId = req.body.postId;
  postModel
    .deletePost(postId)
    .then((result) => {
      req.flash("success", result);
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
    });
}
// ============================================

// ========= delete a comment  ===============
function deleteComment(req, res) {
  const commentId = req.body.commentId;
  commentModel
    .deleteComment(commentId)
    .then((result) => {
      req.flash("success", result);
      if (req.body.path) {
        res.redirect(req.body.path);
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect(req.body.path);
    });
}
// ============================================

exports.savePost = savePost;
exports.addPost = addPost;
exports.addComment = addComment;
exports.deletePost = deletePost;
exports.deleteComment = deleteComment;

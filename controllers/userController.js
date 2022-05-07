const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");

// ======== save a post =======================
function savePost(req, res) {
  const { userName, postId } = req.body;

  userModel
    .savePost(userName, postId)
    .then((result) => {
      req.flash("success", result);
      res.redirect("/");
    })
    .catch((error) => {
      req.flash("error", error);
      res.redirect("/");
    });
}
// ============================================

// ========= add new comment to post ==========
function addComment(req, res) {
  const comment = req.body;
  commentModel
    .addNewComment(comment)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => console.log(error));
  res.redirect("/");
}
// ============================================

exports.savePost = savePost;
exports.addComment = addComment;

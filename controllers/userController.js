const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");

// ======== save a post =======================
function savePost(req, res) {
  const userName = req.body.userName;
  const postId = req.body.postId;
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

// ========= remove post from saved ===========
function unSavePost(req, res) {
  const postId = req.body.postId;
  userModel
    .unSavePost(req.session.userName, postId)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
  res.redirect(`/user/savedPosts?userName=${req.session.userName}`);
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
    .then(() => {
      commentModel
        .deletePostComments(postId)
        .then((delet) => console.log(delet));
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
    });
}
// ============================================

// ========= edit a post  ===============
function editPost(req, res) {
  const postId = req.body.postId;
  const newPost = req.body.newPost;
  postModel
    .editPost(postId, newPost)
    .then((result) => {
      req.flash("success", result);

      res.redirect("/post?id=" + postId);
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/post?id=" + postId);
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

// ========= edit Comment  =====================
function editComment(req, res) {
  const commentId = req.body.commentId;
  const newComment = req.body.newComment;
  commentModel
    .editComment(commentId, newComment)
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

// ========= get saved posts page =============
function savedPosts(req, res) {
  const userNameSession = req.session.userName;
  const userName = req.query.userName;

  if (userNameSession == userName) {
    userModel
      .getSavedPosts(userName)

      .then(async (savedPosts) => {
        await postModel
          .getSavedPosts(savedPosts.savedPosts)

          .then((posts) => {
            res.render("savedPosts", {
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
          });
      })
      .catch((error) => console.log(error));
  } else {
    res.redirect("/");
  }
}
// ============================================

exports.savePost = savePost;
exports.addPost = addPost;
exports.addComment = addComment;
exports.deletePost = deletePost;
exports.deleteComment = deleteComment;
exports.editComment = editComment;
exports.savedPosts = savedPosts;
exports.unSavePost = unSavePost;
exports.editPost = editPost;

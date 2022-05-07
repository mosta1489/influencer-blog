const userModel = require("../models/userModel");

function savePost(req, res) {
  const { userName, postId } = req.body;

  userModel
    .savePost(userName, postId)
    .then((result) => {
      req.flash("success", result);
      res.redirect("/");
    })
    .catch((error) => {
      req.flash(error, error);
      console.log(error);
    });
}

exports.savePost = savePost;
